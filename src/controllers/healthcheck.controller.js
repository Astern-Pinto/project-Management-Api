import {ApiResponses} from "../utils/api-responses.js";
import { asyncHandler } from "../utils/async-handler.js";



const healthCheck = asyncHandler(async (req, res)=>{
     res
     .status(200)
     .json(new ApiResponses(200,{message:"Server is healthy"}));
})

export { healthCheck };