let Response = {


    setSuccess: function (successData) {

        let result = {};
        result.Data = successData;
        if(!result.TotalCount)
        {
            if(Array.isArray(successData))
                result.TotalCount= successData.length;
            else
                result.TotalCount=1;
        }

        result.IsSuccess = true;
        return result;
    },

    setError: function (errCode, errMsg, customMsg) {

        let result = {};

        result.IsSuccess = false;
        result.ErrorCode = errCode;
        if (customMsg)
            result.ErrorMessage = customMsg;
        else
            result.ErrorMessage = null;

        if (errMsg)
            result.ErrorDetail = errMsg;
        else result.ErrorDetail = null;

        return result;
    }
};



module.exports = Response;