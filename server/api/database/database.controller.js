'use strict';

var _ = require('lodash');
var sql = require('sqlite3');

var db = new sql.Database('spells.db',
    function(err){
      console.log("Opening database...");
      if(err) {
        console.log("!!ERROR while opening database: " + err);
      }
    });

var prepareQuery = function(terms) {
  var andflag = false;
  var classjoinflag = false;
  var schooljoinflag = false;
  var query = "SELECT spellname, short_description, resource ";
  var table = "FROM spells ";
  var filter = "WHERE ";

  if(terms["spellname"]) {
    filter += "spellname LIKE $spellname ";
    andflag = true;
  }
  if(terms["casting_time"]) {
    if(andflag) filter += "AND ";
    filter += "casting_time LIKE $casting_time ";
    andflag = true;
  }
  if(terms["components"]) {
    if(andflag) filter += "AND ";
    filter += "components LIKE $components ";
    andflag = true;
  }
  if(terms["range"]) {
    if(andflag) filter += "AND ";
    filter += "range LIKE $range ";
    andflag = true;
  }
  if(terms["target"]) {
    if(andflag) filter += "AND ";
    filter += "target LIKE $target ";
    andflag = true;
  }
  if(terms["effect"]) {
    if(andflag) filter += "AND ";
    filter += "effect LIKE $effect ";
    andflag = true;
  }
  if(terms["duration"]) {
    if(andflag) filter += "AND ";
    filter += "duration LIKE $duration ";
    andflag = true;
  }
  if(terms["saving_throw"]) {
    if(andflag) filter += "AND ";
    filter += "saving_throw LIKE $saving_throw ";
    andflag = true;
  }
  if(terms["spell_resistance"]) {
    if(andflag) filter += "AND ";
    filter += "spell_resistance LIKE $spell_resistance ";
    andflag = true;
  }
  if(terms["description"]) {
    if(andflag) filter += "AND ";
    filter += "description LIKE $description ";
    andflag = true;
  }
  if(terms["short_description"]) {
    if(andflag) filter += "AND ";
    filter += "short_description LIKE $short_description ";
    andflag = true;
  }
  if(terms["resource"]) {
    if(andflag) filter += "AND ";
    filter += "resource LIKE $resource ";
    andflag = true;
  }
  if(terms["class"]) {
    if(andflag) filter += "AND ";
    filter += "class LIKE $class ";
    andflag = true;
    table += "NATURAL JOIN castinglevelbyclass ";
    classjoinflag = true;
  }
  if(terms["level"]) {
    if(andflag) filter += "AND ";
    filter += "level LIKE $level ";
    andflag = true;
    if(!classjoinflag) table += "NATURAL JOIN castinglevelbyclass ";
  }
  if(terms["domain"]) {
    if(andflag) filter += "AND ";
    filter += "domain LIKE $domain ";
    andflag = true;
    table += "NATURAL JOIN domains ";
  }
  if(terms["school"]) {
    if(andflag) filter += "AND ";
    filter += "school LIKE $school ";
    andflag = true;
    table += "NATURAL JOIN schools ";
    schooljoinflag = true;
  }
  if(terms["subschool"]) {
    if(andflag) filter += "AND ";
    filter += "subschool LIKE $subschool ";
    andflag = true;
    if(!schooljoinflag) table += "NATURAL JOIN schools ";
  }
  if(terms["descriptor"]) {
    if(andflag) filter += "AND ";
    filter += "descriptor LIKE $descriptor ";
    andflag = true;
    table += "NATURAL JOIN descriptors ";
  }

  if(filter.length > 6)
    return query + table + filter + ";";
  return "ERROR: no terms";

}

var prepareTerms = function(terms) {
  for (var key in terms) {
    if(terms.hasOwnProperty(key)){
      terms[key] = "%" + terms[key].replace(/\s+/g, "%") + "%";
      terms["$"+key] = terms[key];
      delete terms[key];
    }
  }
  return terms;
}

// Get list of databases
exports.index = function(req, res) {
  db.get("SELECT spellname, short_description, resource FROM spells ORDER BY RANDOM() LIMIT 1",
      function(err, row){
        if(err){
          console.log("Error in retrieving random spell:");
          console.log(err);
          res.json({spellname: "Fireball",
                    desc:"A fiery explosion deals 1d6/lvl dmg"});
        } else {
          res.json(row);
        }
      });
};

exports.query = function(req, res) {
  //args are in req.query
  var terms = req.query;

  var query = prepareQuery(terms);
  console.log("Query to run: \n" + query);
  var preparedterms = prepareTerms(terms);

  db.all(query, preparedterms, function(err, rows){
    if(!err){
      console.log("Spells retrieved: " + rows.length);
      res.json(rows);
    }
    else {
      res.json(err);
    }
  });
}

exports.spell = function(req, res) {
  var spellname = req.query.spellname;
  var returndata = {};

  db.get("SELECT * FROM spells NATURAL JOIN schools WHERE spellname LIKE ?", spellname,
    function(err, row){
      if(err || !row){
        res.json({ err: "There is no spell with that name" });
      } else {
        returndata = row; //base spell data;

        db.all("SELECT class, level FROM castinglevelbyclass WHERE spellname LIKE ?",
          spellname,
          function(err, rows) {
            if(err || !rows){
              //do something about the error that shouldn't happen
              res.json(returndata); //just returning the current whatever right now
            } else {
              returndata["classes"] = rows
              db.all("SELECT descriptor FROM descriptors WHERE spellname LIKE ?",
                spellname,
                function(err, rows){
                  if(err){
                    res.json(returndata);
                  } else {
                    returndata["descriptors"] = [];
                    for(var i=0; i<rows.length; i++){
                      returndata["descriptors"].push(rows[i]["descriptor"]);
                    }
                    db.all("SELECT domain FROM domains WHERE spellname LIKE ?",
                      spellname,
                      function(err, rows){
                        if(err || !rows){
                          res.json(returndata);
                        } else {
                          returndata["domains"] = [];
                          for(var i=0; i<rows.length; i++){
                            returndata["domains"].push(rows[i]["domain"]);
                          }
                          res.json(returndata);
                        }
                      });
                  }
                });
            }
          });
      }
    });
}
