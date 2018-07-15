 
const GoogleRssRoute = require('./routes/GoogleRssRoute');
const crud = require("./database/crud");
const GoogleRss = require('./models/GoogleRss');


let unitTest = {

    initialize: () => {

    },


    run: () => {

        // let textIn = "";


        // crud.select("5b498224a34ec400149865b4").then((text) => {
        //         console.log(2, text);
        //      });


        // translater.tr2en("merhaba arkadaşım").then((text) => {
        //     console.log(2, text);

        //     unitTest.classifyTextOfText(text);
        // });

        



 





    },


    classifyTextOfText: (text) => {
        // [START language_classify_string]
        // Imports the Google Cloud client library
        const language = require('@google-cloud/language');

        // Creates a client
        const client = new language.LanguageServiceClient();

        /**
         * TODO(developer): Uncomment the following line to run this code.
         */
        // const text = 'Your text to analyze, e.g. Hello, world!';

        // Prepares a document, representing the provided text
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        // Classifies text in the document
        client
            .classifyText({ document: document })
            .then(results => {
                const classification = results[0];

                console.log('Categories:');
                classification.categories.forEach(category => {
                    console.log(
                        `Name: ${category.name}, Confidence: ${category.confidence}`
                    );
                });
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
        // [END language_classify_string]
    }

};


module.exports = unitTest;

