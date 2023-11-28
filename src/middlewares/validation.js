const Joi = require('joi'); 
const asyncHandler = require('../utils/async-handler');

const tracks = ['SW 엔지니어 트랙', '풀스택 AI 트랙'];
const userRoles = ['USER','COACH','ADMIN'];

const userValidation = { 
	signup : asyncHandler( async (req, res, next) => { 
    	const schema = Joi.object().keys({ 
    		name: Joi.string().min(1).max(30).required(),
        	email: Joi.string().email().required(),
            password: Joi.string().min(1).max(30).required(),
            generation_type: Joi.string().valid(...tracks).required(),
            generation_number: Joi.number().min(1).max(2).required(),
        }); 

        await schema.validateAsync(req.body); 
        return next();
    }),

    login : asyncHandler( async (req, res, next) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(1).max(30).required()
        })

        await schema.validateAsync(req.body);
        return next();
    }),

    patchUser : asyncHandler( async (req, res, next) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().forbidden().empty(''),
    		name: Joi.string().min(1).max(30),
            password: Joi.string().min(1).max(30),
            generation_type: Joi.string().valid(...tracks),
            generation_number: Joi.number().min(1).max(2),
            profile_url: Joi.string().allow(""),
            roles: Joi.string().valid(...userRoles),
            links: Joi.string().forbidden().empty(''),
            skills: Joi.string().email().forbidden().empty('')
        })

        await schema.validateAsync(req.body);
        return next();
    }),

    checkUser : asyncHandler( async (req, res, next) => {
        const schema = Joi.object().keys({
    		name: Joi.string().min(1).max(30).required(),
            email: Joi.string().email().required()
        })

        await schema.validateAsync(req.body);
        return next();
    }),

    checkCode : asyncHandler( async (req, res, next) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            code: Joi.string().length(6).required()
        })

        await schema.validateAsync(req.body);
        return next();
    }),

    passwordReset : asyncHandler( async (req, res, next) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            code: Joi.string().length(6).required(),
            password: Joi.string().min(1).max(30)
        })

        await schema.validateAsync(req.body);
        return next();
    })
}; 
    
module.exports = { 
    userValidation
};