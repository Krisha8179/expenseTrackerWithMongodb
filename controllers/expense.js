const Expense = require('../models/Expense');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

function isStringInvalid(str){
    if(str == undefined || str.length === 0){
        return true
    }
    else{
        return false
    }
}

exports.addExpense = async (req, res, next) => {
    try{
    
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const totalCost = Number(req.user.totalCost) + Number(amount);
    

    if(isStringInvalid(description) || isStringInvalid(category) || isStringInvalid(amount)){
        return res.status(400).json({err: "some parameters missing"})
    }

    const data = new Expense({amount: amount,description: description,category: category, userId:req.user})
    await data.save()

    req.user.totalCost = totalCost;
    await req.user.save();

    return res.status(201).json({newExpense: data, message: "expense added"});
    } catch(err){
        console.log(err);
        res.status(500).json({error: err})
    };
}


exports.getExpenses = async (req,res)=> {

    try{
    const page = Number(req.query.page || 1);
    const ITEMS_PER_PAGE = Number(req.query.limit)
    const totalExpenses = await Expense.count({userId: req.user._id});
    const expenses = await Expense.find({
        userId: req.user._id})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)

    return res.status(200).json({
        allExpenses: expenses,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalExpenses,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalExpenses / ITEMS_PER_PAGE) 
    })
    } catch(err){
        console.log('error in getting expenses', err);
        return res.status(500).json({error: err})
    }
}



exports.deleteExpense =  async (req, res) => {
    try{
        const expenseId = req.params.id;
        if(expenseId== 'undefined' || expenseId.length == 0){
            console.log('Id is missing')
            return res.status(400).json({err: 'ID is missing'})
        }
        const expenseObj = await Expense.findOne({_id: expenseId});
        const totalCost = Number(req.user.totalCost) - Number(expenseObj.amount);

        await Expense.findByIdAndRemove({_id: expenseId, userId: req.user._id});
        req.user.totalCost = totalCost;
        await req.user.save();
        
        return res.status(200).json({success: true, message: "successfully deleted"});
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "failed"})
    }
}

