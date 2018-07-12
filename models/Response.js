let Response = {


    setSuccess: function (successData, totalCount) {

        let result = {};
        result.Data = successData;
        result.TotalCount = totalCount;
        if (!result.TotalCount) {
            if (Array.isArray(successData))
                result.TotalCount = successData.length;
            else
                result.TotalCount = 1;
        }

        result.IsSuccess = true;
        return result;
    },

    setError: function (errCode, errMsg, customMsg) {

        let result = {};
        result.Data = {
            docs: [],
            limit: 0,
            offset: 0,
            total: 0
        };
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