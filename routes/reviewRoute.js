import { addReview, getReviews, deleteReview, approveReview} from "../Controllers/reviewController.js";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/authorization.js";
import express from "express";
let reviewRoute = express.Router();

reviewRoute.post('/',authorization("customer"),async (req,res)=>{
    console.log(req.user);
    try{
        await addReview(req.body);
        res.status(201).json({
            "message" : "Review added successfully"
        });
    }catch(err){
        res.status(500).json({
            "message" : "error while adding review"
        })
    }
});

reviewRoute.get('/',async (req,res)=>{
    try{
        let reviews = await getReviews(req);
        res.status(201).json({
            "message":"Reviews: "
        ,reviews
        });
    }catch(err){
        res.status(500).json({
            "message" : "error while fetching reviews"
        });
    }
});



reviewRoute.put("/approve/:email",authorization("admin"),async (req,res)=>{
    try{
        const updatedReview = await approveReview(req.user.role, req.params.email);
        if(!updatedReview){
            return res.status(404).json({
                "message":"Review not found"
            })
        }
        res.status(200).json({
            "message":"Review approved successfully",
            "review": updatedReview
        });
    }catch(err){
        // if(err.message === "Unauthorized"){
        //     return res.status(403).json({
        //         "message":"Only admin can approve reviews"
        //     })
        // }
        console.error(err);
        res.status(500).json({
            "message": "error while approving review "
        })
    }
});

reviewRoute.delete('/:email',async (req,res)=>{
    try{
        const result = await deleteReview(req.user,req.params.email);
        if(result.deletedCount ===0){
            return res.status(404).json({
                "message":"Review not found or unauthorized"
            })
        }
        res.status(200).json({
            "message":"deletetion successfull"
        });
    }catch(err){
        if(err.message === "Unauthorized"){
            return res.status(403).json({
                "message":"you can only delete your own review"
            })
        }
        res.status(500).json({
            "message": "error while deleting review"
        })
    }
});

export default reviewRoute;