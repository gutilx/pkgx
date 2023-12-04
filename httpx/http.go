package httpx

import (
	"bytes"
	"encoding/json"
	"github.com/madlabx/pkgx/errorx"
	"github.com/madlabx/pkgx/log"
	"io/ioutil"
	"net"
	"net/http"
	"strings"
	"time"
)

func GetRealIp(req *http.Request) string {

	hip := req.Header.Get("X-Forwarded-For")
	if hip != "" {
		idx := strings.Index(hip, ",")
		if idx > 0 {
			return hip[:idx]
		}
		return hip
	}

	hip = req.Header.Get("X-Real-IP")
	if hip != "" {
		return hip
	}

	ip, _, _ := net.SplitHostPort(req.RemoteAddr)
	return ip
}

func HttpGetBody(url string, timeout int) (*http.Response, []byte, error) {
	return requestBytesForBody("GET", url, nil, timeout, true)
}

func HttpGet(url string, timeout int) (*http.Response, error) {
	return requestBytes("GET", url, nil, timeout)
}

func HttpPostBody(url string, body interface{}, timeout int) (*http.Response, []byte, error) {
	b, err := json.Marshal(body)
	if err != nil {
		log.Errorf("Parse json failed, url: %s, obj: %#v", url, body)
		return nil, nil, errorx.NewStatusError(http.StatusBadRequest, errorx.ECODE_BAD_REQUEST_PARAM, err)
	}

	return requestBytesForBody("POST", url, b, timeout, true)
}

func HttpPost(url string, body interface{}, timeout int) (*http.Response, error) {
	b, err := json.Marshal(body)
	if err != nil {
		log.Errorf("Parse json failed, url: %s, obj: %#v", url, body)
		return nil, errorx.NewStatusError(http.StatusBadRequest, errorx.ECODE_BAD_REQUEST_PARAM, err)
	}

	return requestBytes("POST", url, b, timeout)
}

func requestBytes(method, url string, bodyBytes []byte, timeout int) (*http.Response, error) {
	resp, _, err := requestBytesForBody(method, url, bodyBytes, timeout, false)
	return resp, err
}

func requestBytesForBody(method, requrl string, bodyBytes []byte, timeout int, wantBody bool) (*http.Response, []byte, error) {
	client := &http.Client{
		Timeout: time.Second * time.Duration(timeout),
	}
	req, err := http.NewRequest(method, requrl, bytes.NewReader(bodyBytes))

	if err != nil {
		log.Errorf("failed to build request, err:%#v", err.Error())
		return nil, nil, err
	}
	if method == "POST" {
		req.Header.Set("Content-Type", "application/json")
	}
	req.Header.Set("Connection", "close")
	rsp, err := client.Do(req)
	if err != nil {
		log.Errorf("failed to send request, err:%#v", err.Error())
		return nil, nil, errorx.UnWrapperError(err)
	}
	defer func() {
		if rsp != nil {
			rsp.Body.Close()
		}
	}()

	if rsp.StatusCode != http.StatusOK && rsp.StatusCode != http.StatusCreated {
		body, err := ioutil.ReadAll(rsp.Body)
		if err != nil {
			log.Errorf("read body err, err:%v, response:%v", err.Error(), rsp)
			return nil, nil, err
		}

		return rsp, body, err
	}

	if wantBody {
		body, err := ioutil.ReadAll(rsp.Body)
		if err != nil {
			log.Errorf("read body err, %v", err.Error())
			return nil, nil, err
		}
		return rsp, body, err
	}

	return rsp, nil, err
}

func requestBytesForBodyNormal(method, requrl string, bodyBytes []byte, wantBody bool) (*http.Response, []byte, error) {
	client := &http.Client{
		Timeout: 20 * time.Second,
	}
	req, err := http.NewRequest(method, requrl, bytes.NewReader(bodyBytes))

	if err != nil {
		log.Errorf("failed to build request, err:%#v", err.Error())
		return nil, nil, err
	}
	if method == "POST" {
		req.Header.Set("Content-Type", "application/json")
	}
	req.Header.Set("Connection", "close")
	rsp, err := client.Do(req)
	if err != nil {
		log.Errorf("failed to send request, err:%#v", err.Error())
		return nil, nil, errorx.UnWrapperError(err)
	}
	defer func() {
		if rsp != nil {
			rsp.Body.Close()
		}
	}()

	if rsp.StatusCode != http.StatusOK && rsp.StatusCode != http.StatusCreated {
		body, err := ioutil.ReadAll(rsp.Body)
		if err != nil {
			log.Errorf("read body err, err:%v, response:%v", err.Error(), rsp)
			return nil, nil, errorx.NewStatusErrStr(rsp.StatusCode, errorx.ECODE_FAILED_HTTP_REQUEST, "Failed to parse response body")
		}

		//log.Errorf("Got not 200 response[%#v], body[%v]", rsp, string(body))

		newStatusError := new(errorx.StatusError)
		err = json.Unmarshal(body, newStatusError)
		if err != nil {
			log.Errorf("read body err, err:%v, response:%v", err.Error(), rsp)
			return nil, nil, errorx.NewStatusErrStr(rsp.StatusCode, errorx.ECODE_FAILED_HTTP_REQUEST, "Failed to parse error information: "+string(body))
		}
		newStatusError.Status = rsp.StatusCode

		if newStatusError.Code == errorx.ECODE_SUCCESS {
			newStatusError.Code = errorx.ECODE_FAILED_HTTP_REQUEST
			newStatusError.Message = string(body)
		}
		//log.Errorf("err:%v", newStatusError)

		return rsp, body, newStatusError
	}

	if wantBody {
		body, err := ioutil.ReadAll(rsp.Body)
		if err != nil {
			log.Errorf("read body err, %v", err.Error())
			return nil, nil, errorx.NewStatusErrStr(rsp.StatusCode, errorx.ECODE_FAILED_HTTP_REQUEST, "Failed to parse response body")
		}
		return rsp, body, err
	}

	return rsp, nil, err
}

func ResponseToMap(body []byte) (map[string]interface{}, error) {
	var set map[string]interface{}
	if err := json.Unmarshal(body, &set); err != nil {
		log.Errorf("Unmarshal err, %v", err.Error())
		return nil, err
	}
	return set, nil
}
