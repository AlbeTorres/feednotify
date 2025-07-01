import { Request, Response } from "express";
import { CreateNewsletterSchema } from "../../validators/newsletter.schema";
import createError from 'http-errors';
import * as z from 'zod';
import { createNewsletterService } from "../../services/newsletter/createNewsletter.service";

export async function createNewsletter(req:Request, res:Response) {
    const {name, category,sources}=req.body

    const userId= req.user?.id

    const validateFields=CreateNewsletterSchema.safeParse({
        name,category,sources,userId
    })

    if(!validateFields.success){
        throw new createError.BadRequest('Invalid Input data');
    }


      if (!userId) {
        throw new createError.Unauthorized('User ID is required');
      }

    try {

        const response= await createNewsletterService({name, category,sources,userId})

        if (response.success) {
              res
                .status(200)
                .json({ message: response.msg, newsletter: response.newNewsletter });
            } else {
              throw new createError.InternalServerError('Error creating newsletter');
            }
        
    } catch (err:unknown) {
         if (err instanceof createError.HttpError) {
              throw err;
            }
        
            if (err instanceof z.ZodError) {
              throw new createError.BadRequest(
                'Internal valiadation error: ' + err.message
              );
            }
        
            console.error('[Create Newsletter Error]', err);
            throw new createError.InternalServerError(
              'Unespected error creating Newsletter: ' + (err as string)
            );
        
    }


}