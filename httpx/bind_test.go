package httpx

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo"
	"github.com/madlabx/pkgx/errors"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Here we'll define a mock echo.Context
type MockContext struct {
	echo.Context
	mock.Mock
}

func (m *MockContext) QueryParam(name string) string {
	args := m.Called(name)
	return args.String(0)
}

func (m *MockContext) Bind(i interface{}) error {
	args := m.Called(i)
	return args.Error(0)
}

type handleFunc func() echo.Context

func TestBindAndValidate(t *testing.T) {
	// Define our test cases
	mockRequest := func(method, uri string, body io.Reader) handleFunc {
		return func() echo.Context {
			e := echo.New()
			req := httptest.NewRequest(method, uri, body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			return c
		}
	}
	mockRequestWithHeaders := func(method, uri string, body io.Reader, header http.Header) handleFunc {
		return func() echo.Context {
			e := echo.New()
			req := httptest.NewRequest(method, uri, body)
			req.Header = header
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			return c
		}
	}
	as := func(expect, output any) any {
		return assert.Equal(t, expect, output)
	}
	testCases := []struct {
		testName      string
		buildContext  handleFunc
		structFunc    func(any) any
		expectedError error
	}{
		{
			testName:     "ValidQueryParams",
			buildContext: mockRequest(http.MethodGet, "/?bandwidth=2", nil),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth uint64 `hx_place:"query" hx_must:"true" hx_name:"bandwidth" hx_default:"1" hx_range:"1-10"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(uint64(2), parsed.(*inputStruct).Bandwidth)
			},
			expectedError: nil,
		},
		{
			testName:     "MissingRequiredQueryParam",
			buildContext: mockRequest(http.MethodGet, "/?lostparam=2", nil),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth uint64 `hx_place:"query" hx_must:"true" hx_query_name:"bandwidth" hx_default:"1" hx_range:"1-10"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(uint64(2), parsed.(*inputStruct).Bandwidth)
			},

			expectedError: errors.New("missing query parameter Bandwidth"),
		},

		{
			testName:     "BodyInt64Value",
			buildContext: mockRequest(http.MethodGet, "/", strings.NewReader(`{"Bandwidth":1}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth uint64 `hx_must:"true" hx_default:"1" hx_range:"1-10"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(uint64(1), parsed.(*inputStruct).Bandwidth)
			},

			expectedError: nil,
		},

		{
			testName:     "BodyIntLostMust",
			buildContext: mockRequest(http.MethodGet, "/", nil),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth uint64 `hx_must:"true" hx_range:"0-10"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(uint64(0), parsed.(*inputStruct).Bandwidth)
			},

			expectedError: errors.New("missing parameter Bandwidth"),
		},
		{
			testName:     "BodyAnonymousMember",
			buildContext: mockRequest(http.MethodGet, "/", strings.NewReader(`{"Name":"test", "PageNum":1, "SortOrder":"asec"}`)),
			structFunc: func(parsed any) any {

				type FilterStruct struct {
					FilterField    string
					FilterOperator string `hx_range:"eq,gt,lt,in" hx_default:"eq"`
					FilterValue    string
				}
				type PageStruct struct {
					PageNum  int
					PageSize int
					TotalNum int64
				}
				type SortStruct struct {
					SortField string
					SortOrder string
				}
				type inputStruct struct {
					PageStruct
					SortStruct
					FilterStruct
					Name    string `hx_must:"true"`
					Recurse bool
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as("asec", parsed.(*inputStruct).SortOrder)
			},

			expectedError: nil,
		},

		{
			testName:     "BodyDeepAnonymousMember",
			buildContext: mockRequest(http.MethodGet, "/", strings.NewReader(`{"Name":"test", "PageNum":1, "SortOrder":"asec", "PageNum":2}`)),
			structFunc: func(parsed any) any {

				type FilterStruct struct {
					FilterField    string
					FilterOperator string `hx_range:"eq,gt,lt,in" hx_default:"eq"`
					FilterValue    string
				}
				type PageStruct struct {
					PageNum  int
					PageSize int
					TotalNum int64
				}
				type SortStruct struct {
					SortField string
					SortOrder string
					PageStruct
				}
				type inputStruct struct {
					//PageStruct
					SortStruct
					FilterStruct
					Name    string `hx_must:"true"`
					Recurse bool
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(2, parsed.(*inputStruct).PageNum)
			},

			expectedError: nil,
		},
		{
			testName:     "BodyEmptyArray",
			buildContext: mockRequest(http.MethodGet, "/", strings.NewReader(`{"Name":"test", "PageNum":1, "SortOrder":"asec", "PageNum":2}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth []uint64 `hx_must:"true" hx_range:"0-10"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(uint64(0), parsed.(*inputStruct).Bandwidth)
			},

			expectedError: errors.New("missing parameter Bandwidth"),
		},
		{
			testName:     "BodyEmpty",
			buildContext: mockRequest(http.MethodGet, "/", nil),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth uint64 `hx_must:"true" hx_range:"0-10"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(uint64(0), parsed.(*inputStruct).Bandwidth)
			},

			expectedError: errors.New("missing parameter Bandwidth"),
		},
		{
			testName:     "InHeader",
			buildContext: mockRequestWithHeaders(http.MethodGet, "/", nil, http.Header{"X-Client-Id": {"172.1.2.1"}}),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					ClientIp string `hx_name:"X-Client-ID" hx_place:"header" hx_must:"true"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as("172.1.2.1", parsed.(*inputStruct).ClientIp)
			},

			expectedError: nil,
		},
		{
			testName:     "InHeaderMiss",
			buildContext: mockRequestWithHeaders(http.MethodGet, "/", nil, http.Header{"ClientId": {"172.1.2.1"}}),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					ClientId string `hx_place:"header" hx_must:"true"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as("172.1.2.1", parsed.(*inputStruct).ClientId)
			},

			expectedError: errors.New("missing header parameter ClientId"),
		},
		{
			testName:     "InHeaderName",
			buildContext: mockRequestWithHeaders(http.MethodGet, "/", nil, http.Header{"X-Real-Ip": {"172.1.2.1"}}),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					ClientId string `hx_place:"header" hx_name:"X-Real-Ip" hx_must:"true"`
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as("172.1.2.1", parsed.(*inputStruct).ClientId)
			},

			expectedError: nil,
		},
		{
			testName:     "PatchSetBodyValues",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2", strings.NewReader(`{"Bandwidth":1, "Quality":{"Level":1.0}}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth uint64 `hx_must:"true" hx_range:"0-10"`
					Quality   struct {
						Level float64 `hx_must:"true"`
					}
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(1.0, parsed.(*inputStruct).Quality.Level)
			},

			expectedError: nil,
		},
		{
			testName:     "TestDeepPtrMember",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2.1", strings.NewReader(`{"Bandwidths":[1,2,3,4], "Quality":{"Level":1.0}}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					//Bandwidth []uint64 `hx_must:"false" hx_range:"0-10"`
					Bandwidths []uint64 `hx_must:"false" hx_range:"0-10"`
					Quality    struct {
						Level *float64 `hx_must:"false"`
					}
				}

				if parsed == nil {
					return &inputStruct{}
				}
				//as(parsed.(*inputStruct).Bandwidths, []uint64{1, 2, 3, 4})
				return as(1.0, *(parsed.(*inputStruct).Quality.Level))
			},

			expectedError: nil,
		},
		{
			testName:     "TestUintArray",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2.1", strings.NewReader(`{"Bandwidths":[1,2,3,4], "Quality":{"Level":1.0}}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					//Bandwidth []uint64 `hx_must:"false" hx_range:"0-10"`
					Bandwidths []uint64 `hx_must:"false" hx_range:"0-10"`
					Quality    struct {
						Level float64 `hx_must:"false"`
					}
				}

				if parsed == nil {
					return &inputStruct{}
				}
				as(parsed.(*inputStruct).Bandwidths, []uint64{1, 2, 3, 4})
				return as(1.0, parsed.(*inputStruct).Quality.Level)
			},

			expectedError: nil,
		}, {
			testName:     "TestStringArray",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2.1", strings.NewReader(`{"Dirs":["test/wefwe", "123dir"]}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					//Bandwidth []uint64 `hx_must:"false" hx_range:"0-10"`
					Dirs    []string `hx_must:"false"`
					Quality struct {
						Level float64 `hx_must:"false"`
					}
				}

				if parsed == nil {
					return &inputStruct{}
				}
				return as(parsed.(*inputStruct).Dirs, []string{"test/wefwe", "123dir"})
			},

			expectedError: nil,
		},
		{
			testName:     "TestLongInt",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2.1", strings.NewReader(`{"Level":1712652096}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Level int `hx_must:"false"`
				}

				if parsed == nil {
					return &inputStruct{}
				}
				return as(1712652096, parsed.(*inputStruct).Level)
			},

			expectedError: nil,
		},
		{
			testName: "TestStructArray",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2.1", strings.NewReader(`{"Dirs":[
    {"Name":"./jonathantest","CreateTime":1712652096},
    {"Name": "123dir"}
    ]
    }`)),
			structFunc: func(parsed any) any {
				type NewStruct struct {
					Name       string
					CreateTime int64
				}
				type inputStruct struct {
					//Bandwidth []uint64 `hx_must:"false" hx_range:"0-10"`
					Dirs    []NewStruct `hx_must:"false"`
					Quality struct {
						Level float64 `hx_must:"false"`
					}
				}

				if parsed == nil {
					return &inputStruct{}
				}
				return as([]NewStruct{{Name: "./jonathantest", CreateTime: 1712652096}, {Name: "123dir"}}, parsed.(*inputStruct).Dirs)
			},

			expectedError: nil,
		},
		{
			testName:     "TestStringArray1",
			buildContext: mockRequest(http.MethodPost, "/we?Level=2.1", nil),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					Bandwidth uint64 `hx_must:"false" hx_range:"0-10"`
					Quality   struct {
						Level float64 `hx_must:"true"`
					}
				}

				if parsed == nil {
					return &inputStruct{}
				}

				return as(2.1, parsed.(*inputStruct).Quality.Level)
			},

			expectedError: nil,
		},
		{
			testName:     "TestArrayEmpty",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2.1", strings.NewReader(`{"Paths":[], "Quality":{"Level":1.0}}`)),
			structFunc: func(parsed any) any {
				type inputStruct struct {
					//Bandwidth []uint64 `hx_must:"false" hx_range:"0-10"`
					Paths []string `hx_must:"true"`
				}

				if parsed == nil {
					return &inputStruct{}
				}
				//as(parsed.(*inputStruct).Bandwidths, []uint64{1, 2, 3, 4})
				return nil
			},

			expectedError: errors.New("missing parameter Paths"),
		},
		{
			testName:     "TestAny",
			buildContext: mockRequest(http.MethodPatch, "/we?Level=2.1", strings.NewReader(`{ "Quality":{"Level":1.0}}`)),
			structFunc: func(parsed any) any {
				type QualityType struct {
					Level float64
				}
				type inputStruct struct {
					Quality any
				}

				if parsed == nil {
					return &inputStruct{}
				}
				as(json.Number("1.0"), parsed.(*inputStruct).Quality.(map[string]interface{})["Level"])
				return nil
			},

			expectedError: nil,
		},
		// Add more test cases as needed.
	}

	for _, tc := range testCases {
		t.Run(tc.testName, func(t *testing.T) {
			c := tc.buildContext()

			// Act - call our function to test
			input := tc.structFunc(nil)
			err := BindAndValidate(c, input)

			if err != nil {
				if tc.expectedError == nil {
					assert.Nil(t, err)
					return
				}
				assert.Equal(t, tc.expectedError.Error(), err.Error())
			} else {
				assert.Equal(t, tc.expectedError, err)
				tc.structFunc(input)
			}
			// Assert - check the output is as expected

		})
	}
}
