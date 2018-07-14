const translateApi = require('google-translate-api');



let translater = {


    tr2en: (text) => {

        var promise = new Promise((resolve, reject) => {
         resolve(translateApi(text, { to: 'en' }));
        });

        return promise.then((data) => {             
            return data.text;
        }).catch((err) => {
            console.error(err);
        });



    }
};


module.exports = translater;



