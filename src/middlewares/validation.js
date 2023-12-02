const Joi = require('joi'); 
const asyncHandler = require('../utils/async-handler');

const userRoles = ['USER','COACH','ADMIN'];

const userValidation = { 
	  signup : asyncHandler( async (req, res, next) => { 
    	const schema = Joi.object().keys({ 
    		    name: Joi.string().min(1).max(30).required(),
        	  email: Joi.string().email().required(),
            password: Joi.string().required(),
            // .min(8)
            // .regex(/^(?=.[a-zA-Z])(?=.[!@#$%^+=-])(?=.[0-9]).{8,25}$/)
            // .required(),
            generation_type: Joi.string().required(),
            generation_number: Joi.number().required(),
            roles: Joi.string().valid(...userRoles),
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
            password: Joi.string(),
            // .min(8)
            // .regex(/^(?=.[a-zA-Z])(?=.[!@#$%^+=-])(?=.[0-9]).{8,25}$/)
            // .required(),
            generation_type: Joi.string(),
            generation_number: Joi.number(),
            profile_url: Joi.string().allow(""),
            roles: Joi.string().valid(...userRoles),
            links: Joi.string().forbidden().empty(''),
            skills: Joi.string().email().forbidden().empty(''),
            is_coach:Joi.boolean()
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
            password: Joi.string().required(),
            // .min(8)
            // .regex(/^(?=.[a-zA-Z])(?=.[!@#$%^+=-])(?=.[0-9]).{8,25}$/)
            // .required(),
        })

        await schema.validateAsync(req.body);
        return next();
    })
}; 

const postValidation = {
  addPost: asyncHandler(async (req, res, next) => {
    const schema = Joi.object().keys({
      title: Joi.string().min(1).max(60).required(),
      content: Joi.string().min(1).max(2000).required(),
      category: Joi.string().valid('BOARD', 'QNA', 'STUDY', 'PROJECT', 'REVIEW').required(),
      image_url: Joi.string().allow(""),
    });

    await schema.validateAsync(req.body);
    next();
  }),

  modifyPost: asyncHandler(async (req, res, next) => {
    const schema = Joi.object().keys({
      title: Joi.string().min(1).max(60),
      content: Joi.string().min(1).max(2000),
      category: Joi.string().valid('BOARD', 'QNA', 'STUDY', 'PROJECT', 'REVIEW'),
      image_url: Joi.string().allow(""),
    });

    await schema.validateAsync(req.body);
    next();
  }),
};

const commentValidation = {
  addComment: asyncHandler(async (req, res, next) => {
    const schema = Joi.object().keys({
      post: Joi.string().required(),
      content: Joi.string().required(),
    });

    await schema.validateAsync(req.body);
    next();
  }),

  modifyComment: asyncHandler(async (req, res, next) => {
    const schema = Joi.object().keys({
      content: Joi.string().required(),
    });

    await schema.validateAsync(req.body);
    next();
  }),
};
    
module.exports = { 
    userValidation,
    postValidation,
    commentValidation
};