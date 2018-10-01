// Define the number of maps that you want to visaulize. Upto 15 maps are supported.

var NumOfMaps = 15; 

/*
/* Example for defining the variabels that you want to visaulize. */
/*
var InitialLayers = ["Heart Disease10", "Heart Disease11", "Heart Disease12", "Heart Disease13"];
*/

var InitialLayers = ["1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005"];

/* Map Extent and Zoom level will be automatically adjusted when you do not define map center and zoom level */
/* Examples for defining map center and zoom level for San Diego and Los Angeles metro area*/
/*
var Initial_map_center = [33.01959536, -116.8387589];      // SD
var Initial_map_zoom_level = 13;                           // range 1 to 20 ?

var Initial_map_center = [33.786671, -118.182354];         // LA
var Initial_map_zoom_level = 10;                           // range 1 to 20 ? 
*/
var Initial_map_center = [39.8283, -90];  
var Initial_map_zoom_level = 3;   

/* It shows the change of number of polygons belonging to each class intervals 
   It appears only when the map extent and the class intervals of all maps are same.
   To make all maps have the same map extent and class intervals, enable "Grouping All" or click "Sync" on each of maps   */
var Stacked_Chart = true;                                  // true or false

//var Num_Of_Decimal_Places = 2;                             // default = 1


var Map_width  = "420px";                                  // min 350px
var Map_height = "300px";                                  // min 300px

var Chart_width  = "300px";                                // min 300px
var Chart_height = "250px";                                // min 200px
