export const getEvents= (req,res)=>{
    res.status(200).json({
        status:'success',
        message: 'Eventos funcionando',
        payload:[]
    })
}