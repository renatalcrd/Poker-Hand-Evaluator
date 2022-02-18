/*
    Author: Renata Dantas
    Date: Fev 09th 2022
    Description: Assignment 2C for PROG2700C - BUILD A POKER HAND EVALUATOR FROM AN API RANDOM DECK
*/

//IIFE - to keep me out of global scope
(() => {

    //POKER HAND EVALUATOR

    // Link API random
    // http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

    // Link of tests
    // Royal Flush -  http://pokerhand-tester.herokuapp.com/royalflush
    // Straight Flush - http://pokerhand-tester.herokuapp.com/straightflush
    // Four of a kind - http://pokerhand-tester.herokuapp.com/fourofakind
    // Full House - http://pokerhand-tester.herokuapp.com/fullhouse
    // Flush - http://pokerhand-tester.herokuapp.com/flush
    // Straight - http://pokerhand-tester.herokuapp.com/straight
    // Three of a kind - http://pokerhand-tester.herokuapp.com/threeofakind
    // Two Pair - http://pokerhand-tester.herokuapp.com/twopair
    // One Pair - http://pokerhand-tester.herokuapp.com/onepair
    // High Card - http://pokerhand-tester.herokuapp.com/highcard
    

     fetch("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            var myDeck = "";
            myDeck = data.deck_id;
       
            //Method2 - promise chaining - chain fetches together
            return fetch(`http://deckofcardsapi.com/api/deck/${myDeck}/draw/?count=5`);
        })
        .then(response2 => response2.json())
        .then(data2 => {
            console.log(data2);
            var pokerHandArr = [];
            for (i=0; i < data2.cards.length; i++)
            {
               pokerHandArr.push(data2.cards[i].code);
               
            }
             
            
    //TEST CODE

    // fetch("http://pokerhand-tester.herokuapp.com/royalflush")       
    //     .then(response2 => response2.json())
    //     .then(data2 => {
    //         var pokerHandArr = [];
    //         for (i=0; i < data2.cards.length; i++)
    //         {
    //             pokerHandArr.push(data2.cards[i].code);
                
    //         }

            var ranks = ["2","3","4","5","6","7","8","9","0","J","Q","K","A"];

            // sort my hand 
            var sortedHand_ = (function(){
              var sortedHand = [];
                for (let i = 0; i < ranks.length; i++) {
                  for (let j = 0; j < pokerHandArr.length; j++) {
                    if (ranks[i] === pokerHandArr[j].charAt(0)) {
                      sortedHand.push(pokerHandArr[j]);
                    }
                  }
                }
                return sortedHand;
            }());           
             
            // separating suits
            var handSuitsArr = [];
            for (i=0; i<sortedHand_.length; i++){
                handSuitsArr.push(sortedHand_[i][1]);
            }        
            
            var handCardRanksArr = [];
            for (i=0; i<sortedHand_.length; i++){
                handCardRanksArr.push(sortedHand_[i][0]);
            }
            
            function countSuits(handSuitsArr){
                var suitCount = {};
                handSuitsArr.forEach(function(x) {
                    suitCount[x] = (suitCount[x] || 0) + 1;
                });
                return suitCount;
            }

            function countRanks(handCardRankArr) {
                let cardCount = {};
                handCardRankArr.forEach(function(x) {
                  cardCount[x] = (cardCount[x] || 0) + 1;
                });
                return cardCount;
              }

            function isFlush() {
              var cntSuitsVar = countSuits(handSuitsArr);
              if (Object.keys(cntSuitsVar).find(key => cntSuitsVar[key] === 5)) {
                return true;
              } else {
                return false;
              }
            }

            function isStraight() {
              var index = ranks.indexOf(handCardRanksArr[0]);
              var ref = ranks.slice(index, index + 5).join("");
              var section = handCardRanksArr.slice(0).join("");
              if (section === "0JQKA" && section === ref) {
                return "royalStraight";
              } else if (section === "2345A" || section === ref) {
                return "straight";
              } else {
                return "FALSE";
              }
            }

            function pairs() {
              let rankCnts = countRanks(handCardRanksArr);
              return Object.keys(rankCnts).filter(key => rankCnts[key] === 2).length;
            }

            //choose the correct hand
            function whichHand() {
              let rCounts = countRanks(handCardRanksArr);
              if (isFlush() === true && isStraight() === "royalStraight") {
                return "Royal Flush";
              } else if (isFlush() === true && isStraight() === "straight") {
                return "Straight Flush";
              } else if (Object.keys(rCounts).find(key => rCounts[key] === 4)) {
                return "Four of a Kind";
              } else if (Object.keys(rCounts).find(key => rCounts[key] === 3) && Object.keys(rCounts).find(key => rCounts[key] === 2)) {
                return "Full House";
              } else if (isFlush() === true) {
                return "Flush";
              } else if (isStraight() === "STRAIGHT") {
                return "Straight";
              } else if (Object.keys(rCounts).find(key => rCounts[key] === 3)) {
                return "Three of a Kind";
              } else if (pairs() === 2) {
                return "Two Pair";
              } else if (pairs() === 1) {
                return "One Pair";
              } else {
                return "High Card " + sortedHand_[sortedHand_.length - 1];
              }  
            }
            
            //function to replace 0 by 10 in the screen
            (function(){
              for (i=0; i<sortedHand_.length; i++){
                if(sortedHand_[i][0] == "0"){
                  sortedHand_[i] = "10" + sortedHand_[i][1];
                }
              }
              return sortedHand_;
            }());
            
            return document.getElementById("myData").innerHTML = "CARDS:" + "<br><br>" + sortedHand_ +  "<br><br>" + whichHand();
            }); 
      
})();