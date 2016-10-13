//URL to use for random word API = http://www.setgetgo.com/randomword/get.php?len=20

var player_input = window.prompt("Please enter your name:");

var hangman_state = 0;

var hangman_alt=["empty noose" , "head only" , "head and body" , "head, body, and one leg" , "head, body, and two legs" , "head, body, two legs, and one arm" , "head, body, two legs, and both arms" ,
"full body and face. Your hangman is dead."]

//var current_hangman = { "image" : "hangman" + hangman_state + ".png" , "alt" : hangman_alt[hangman_state] };


var app = angular.module('myapp', []);

/**/
app.filter('undiscovered', function()
{
    //console.log("filter called.");
    return function(input)
    {
       //console.log("input is : " + input.letter + ", is found = " + input.isfound);
        if (input.isfound == false)
        {
            return "*"
        }

        else
        {
            return input.letter;
        }
    }
});


app.controller('rootctrl', function($scope, $http)
{//-[]

    $scope.playername = player_input;

    //$scope.current_hangman1 = current_hangman;

    $scope.current_hangman = { "image" : "hangman" + hangman_state + ".png" , "alt" : hangman_alt[hangman_state] };

    $scope.current_word = "Click 'Get New Word' to begin.";

//This function puts the word retrieved from the random word REST service into the current_word variable.
    $scope.getword = function()
    {
       // window.alert("ajax service about to be called");

        $http.get('http://www.setgetgo.com/randomword/get.php?') //add 'len=20' to dictate the length of the word (20);
        .then(function success(response)
        {
            $scope.current_word = response.data.toLowerCase();

            //console.log("Word retrieved from REST service successfully. Word is " + $scope.current_word);

            $scope.current_word_array = $scope.current_word.split("");

            $scope.letter_object_array = [];

            for(x in $scope.current_word_array)
            {
                $scope.letter_object_array.push( { letter : $scope.current_word_array[x] , isfound : false} );
            }

            hangman_state = 0;

            $scope.current_hangman = { "image" : "hangman" + hangman_state + ".png" , "alt" : hangman_alt[hangman_state] };
        }
    
        ,function error(response)
        {
            console.error("Unable to retrieve word from REST service", response);
        })
    };

    $scope.input = function(letter)
    {
        if(hangman_state == 7)
            {
                window.alert("GAME OVER.\nTry again by pressing button 'Get New Word'.");
                return;
            }

        if($scope.letter_object_array == undefined)
        {
            window.alert("You do not have a word yet!\nPress button 'Get New Word' to begin.");
            return;
        }

       //console.log("letter is " + letter);

       var valid_letter = false;
       var word_complete = true;

       for(x in $scope.letter_object_array)
       {
           if ($scope.letter_object_array[x].letter == letter)
           {
               $scope.letter_object_array[x].isfound = true;

               valid_letter = true;
           }

           if ($scope.letter_object_array[x].isfound == false)
           {
               word_complete = false;
           }
       }

    if (!valid_letter && !word_complete)
        {
            ++hangman_state;

            $scope.current_hangman = { "image" : "hangman" + hangman_state + ".png" , "alt" : hangman_alt[hangman_state] };

            if(hangman_state == 7)
            {
                window.alert("GAME OVER.\nTry again by pressing button 'Get New Word'.");
            }
        }
      // $scope.current_hangman = { "image" : "hangman" + hangman_state + ".png" , "alt" : hangman_alt[hangman_state] };
      if(word_complete)
       {
           window.alert("YOU WIN!\nTry again by pressing button 'Get New Word'.")
       }

    };
});