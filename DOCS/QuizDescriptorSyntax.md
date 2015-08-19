# Syntax of Quiz Descriptor for Project Awesome version 0.1 

Here is a sample quiz descriptor for version 0.1

```json
{
	"version" : "0.1",
	"title" : "Example QuizJSON",
	"quiz" : [
    	{ 
        	"question": "numberConversions", 
        	"parameters": {"questionType": "bin2hex", minValue: 0, maxValue: 255},
        	"repeat": 5
    	},
    	{ 
        	"question": "orderOfOperations", 
        	"parameters": {"numOperators": 2},
        	"repeat": 5
    	},
    ]
}
```  

# Required properties:

* version, type string
* title, type string
* quiz, type Array

Any additional properties that may be defined at the top level are simply ignored.

# Additional rules for the quiz array:

The quiz array should contain at least one element.

Each element in the quiz array should be a legal question object.

A legal question object has two required properties:
* question: type string, and it should be one of the defined question types known to this version of ProjectAwesome.
* repeat: type integer.  Should be greater than 0

An optional third property is called `parameters`.  
* If present, `parameters` should be an object.  
* The properties of the object are specific to the question type.  
* Unknown or unrecognized properties are just ignored.

