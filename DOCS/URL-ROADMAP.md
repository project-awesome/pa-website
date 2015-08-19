
Rule: Whenever you add a new URL to the web app, add it into this table.

This allows us to make sure we are keeping the URL namespace clean, tidy, sane and stable.

# These URLS are the main pages of navigation for actual human interaction

 URL         					|  GET 	| POST | other | Description        
-------------------------------	| -----	| ---- | ----- | ------------ 
 /           					|   *	|      |       |  main menu           
 /student    					|   *	|      |       |  student main menu  
 /instructor 					|   *	|      |       |  instructor main menu
 /instructor/quizdescriptors 	|   *	|      |       |  create / view my quiz descriptors
 /instructor/export			 	|   *	|      |       |  export project-awesome question as MoodleXML
 /author     					|   *	|      |       |  author main menu
 /developer     				|   *	|      |       |  developer main menu
 /usersettings					|   *	|      |       |  user settings options
 /login							|   *	|      |       |  login page
 /quiz/:id						|	*	|      |       |  select quiz options before quiz
 /quiz/:id/:seed				|	*	|      |       |  take the quiz
 
 
#  /api is for the RESTFUL api used for AJAX style interactions

This list may be incomplete or out of date.   To get the actual URLs used for the API, look at the source code, in files routes/api

## /api/qd is for Quiz Descriptors
 URL         	|  GET  | POST  |  PUT  | DELETE  | Description        
---------------	| -----	| ----- | ----- | ------- | ------------ 
 /api/qd      	|   *   |       |       | 	      | gets all quiz descriptors owned by current login user           
 /api/qd/:id  	|   *   |       |       |         | gets quiz descriptor with id :id
 /api/qd 		|       |   *   |       |         | post a new quiz descriptor


## /api/question is for exporting questions
 URL         								|  GET  | POST  |  PUT  | DELETE  | Description        
-------------------------------------------	| -----	| ----- | ----- | ------- | ------------ 
 /api/question/moodle/:questionType/:seed	|   *   |       |       |         | get MoodleXML file of project awesome questions


## /api/quiz Project Awesome Quizzes
 URL         				|  GET  | POST  |  PUT  | DELETE  | Description        
---------------------------	| -----	| ----- | ----- | ------- | ------------ 
 /api/quiz/:id/:seed?q&k	|   *   |       |       |         | quiz in JSON format (q -> show questions, k = ->show answers, can be 0 or 1)

## /api/user is for User Accounts
 URL         			|  GET  | POST  |  PUT  | DELETE  | Description        
-----------------------	| -----	| ----- | ----- | ------- | ------------ 
 /api/user/:awesome_id	|       |       |   *   |         | update user account info

