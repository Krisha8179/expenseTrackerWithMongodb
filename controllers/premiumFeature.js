const User = require('../models/User');
const Expense = require('../models/Expense');

exports.getUserLeaderBoard = async (req, res) => {
    try{

        const leaderBoardForUsers = await User.find()
            .select('_id Name totalCost')
            .sort({totalCost: -1});
            // {
        //     attributes: ['id', 'Name', 'totalCost'],
        //     order:[['totalCost','DESC']]
        // })

        res.status(200).json(leaderBoardForUsers);

    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}