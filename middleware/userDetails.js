const jwt = require('jsonwebtoken');
const GroupAssign = require('../models/group/groupAssign')

async function auth(req, res, next) {
  const token = req.headers.authorization.replace("Bearer ","");

  if(!token) return res.status(401).send("Access denied. No token provided");
  let DB_find = false;
  if(req.header('group')) DB_find = true;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY,{expiresIn: "1y"});
    req.user = decoded;
    req.user['read_access'] = false;
    req.user['write_access'] = false;
    let AccessDetails = await GroupAssign.findOne({user_id:req.user._id});

    if(AccessDetails && DB_find){
        for (let i = 0; i < AccessDetails.groups.length; i++) {
            let group = AccessDetails.groups[i];
           if(group.group_id == req.header('group')){
            group.access_for_all ? group.access == "write" ? req.user.read_access = req.user.write_access = true : req.user.read_access = group.access == "read" ? true : false: null;
            if(group.access_for_all == false && req.header('location')){
                for (let j = 0; j < group.locations.length; j++) {
                   let location = group.locations[i];
                   if(location.location_id == req.header('location')){
                        location.access == "read" ? req.user.read_access = true:location.access == "write" ? req.user.write_access = req.user.read_access = true : null;
                   }
                }  
            }
           }
            
        }
    }
    if(req.user.role == "Super-Admin") req.user.write_access = req.user.read_access = true;
    next();
  } catch (e) {
    return res.status(400).send({text:"Invalid token",error:e,token:req.header('token')});
  }
};


module.exports = auth;