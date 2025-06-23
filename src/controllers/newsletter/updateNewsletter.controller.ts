import { Request, Response } from "express";
import { UpdateNewsletterSchema } from "../../validators/newsletter.schema";
import createError from 'http-errors';
import * as z from 'zod';
import { updateNewsletterService } from "../../services/newsletter/updateNewsletter.service";

export async function updateNewsletter(req:Request, res:Response) {
    const {id,name, category,sources}=req.body

    const userId= req.user?.id

    const validateFields=UpdateNewsletterSchema.safeParse({
        id,name,category,sources,userId
    })

    if(!validateFields.success){
        throw new createError.BadRequest('Invalid Input data');
    }


      if (!userId) {
        throw new createError.Unauthorized('User ID is required');
      }

    try {

        const response= await updateNewsletterService({id,name, category,sources,userId})

        if (response.success) {
              res
                .status(200)
                .json({ message: response.msg, newsletter: response.updatedNewsletter });
            } else {
              throw new createError.InternalServerError('Error updating newsletter');
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
        
            console.error('[Create Updating Error]', err);
            throw new createError.InternalServerError(
              'Unespected error updating Newsletter: ' + (err as string)
            );
        
    }


}