const Joi = require('joi');
const express = require('express');
const { object } = require('joi');

const app = express()


app.use(express.json());



//Error Handler
app.use((err, req, res, callback) => {
    const status = 400
    const body = "error: JSON parsing failed "
    res.status(status).send(body)
    callback()
  })


//Url
app.post('/api/data', (req, res) => {

    // request body data
     const responseResults = {

        payLoad: req.body['payload'],
        skip: req.body['skip'],
        take: req.body['take'],
        totalRecords: req.body['totalRecords']
     }

    
    // validating the request's body data
    const {error} = validateResultsResponse(responseResults);

    // returning errors, if found.
    if (error) {
        const status = 400
        const body = "Error, please check your payload  "+ error.details[0].message
        res.status(status).send(body)
        return;
    };


    const resultsPayload = responseResults['payLoad']

    //checking tvshows data for errors
    const tvShows = []
   
    for(let i of resultsPayload) {
        
        if (Object.keys(i).length > 3 ) {
            tvShows.unshift(i)
            const payLoadResults = validateResultsPayload(i);

            if (payLoadResults.error) {
                const status = 400
                const body = "Error, please check your payload  "+ payLoadResults.error.details[0].message
                res.status(status).send(body)
                return;
            };
        }
    }


   

   //packing the response data into object.
    const responseData = []

    for(let i of tvShows) {

        const image = i['image'].showImage
        const slug = i['slug']
        const title = i['title']

        if (i["drm"] === true && i['episodeCount'] > 0) {
            const data = {
                image : image,
                slug: slug,
                title: title
            }
    
            responseData.unshift(data)
        }

        
    }


    const response = {
        response: responseData
    }

    res.send(response);
})





app.listen(process.env.PORT || 3000, () => console.log('listing on port 3000'));




// validator
function validateResultsResponse(data) {
    const schema = Joi.object({
        payLoad: Joi.array().required(),
        skip: Joi.number().min(0).required(),
        take: Joi.number().min(0).required(),
        totalRecords: Joi.number().min(0).required()

    });
    return schema.validate(data);
}


//validator 
function validateResultsPayload(data) {
    const schema = Joi.object({
        country: Joi.string().required(),
        description : Joi.string().required(),
        drm: Joi.boolean().required(),
        episodeCount: Joi.number().min(0).required(),
        genre:  Joi.string().required(),
        image: Joi.object().required(),
        language:  Joi.string().required(),
        nextEpisode: Joi.required(),
        primaryColour:  Joi.string().required(),
        seasons: Joi.required(),
        slug :Joi.string().required(),
        title :Joi.string().required().empty(),
        tvChannel :Joi.string().required()
        
    });
    return schema.validate(data);
}