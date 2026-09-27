import User from "../Models/user.model.js"

export const getAssistantConfig=async(req,res)=>{

    try{

        const {userId} = req.params

        const user = await User.findById(userId).select("-geminiApikey")

        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        return res.status(200).json({message:"assistant config data",user})

    }catch(error){
         return res.status(500).json({message:"assistnat not found"})
        

    }
}

export const askAssistant = async(req,res)=>{

    try{

        const {message,userId} = req.body

        if(!message || !userId){
            return res.status(400).json({message:"Message and user id are required"})
        }

        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        
        if(!user.geminiApikey){
            return res.status(404).json({message:"key not found"})
        }

        if(user.plan === "free" && user.totalMessages >= user.requestLimit){
              return res.status(400).json({message:"free limit exceed"})
        }

        if(user.plan==="pro" && new Date(user.proExpireAt) < new Date()){
            user.plan === "free"

            await user.save()
            return res.status(400).json({message:"pro plan expired "})

             

        }

        const cleanMessage = message.toLowerCase()



    }catch(error){

    }
}