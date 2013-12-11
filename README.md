CreateContact
=============

Hello! This is the project, I believe containing everything from the design spec. I thought it might be helpful if I just detailed a bit of it here for you.

Libraries
---------

- jQuery: for everything it's good at...
- Bootstrap: for the responsive grid and some styling of UI elements
- Google Webfonts: for headings
- Modernizr: for detecting touch devices (and if needed for IE, support for HTML5 form elements). 
- Google Maps API: for embedded Google Map and geocoding of address

File Structure
--------------

- css: minified css files
- fonts: fonts needed for Bootstrap glyphs
- img: images, including a src folder with source images
- js: javascript files (minified and not)
- scss: SASS stylesheets

Custom "Add Image" UI
---------------------

In the two areas where a user may attach a photo, I wrote a custom widget which allows the user to click a placeholder image which gets replaced with whatever image they select. You can see in library.js (where all the custom js is for this page) that we do a couple of cool things to get this smooth UX. When an image is selected it gets read out via HTML5's FileReader API, written to an invisible canvas and cropped to a square, and then read out of the canvas and back to the page.

Add Phone & Email
-----------------

Both of these sections add new content via a modal form. Phone auto-formats the number so the user can't make mistakes, and validates that the user has selected a type for each number. Email validates that their email is a valid email address. Both forms allow a user to set this number/email as primary. Primary numbers/emails will be promoted to the top of the list.

Once added to the page they can be edited, deleted, and the user may select a different primary. Once again- the primary number/email will be promoted to the top of the list.

Addresses
---------

Addresses are pretty self explantory. Job Location allows for the user to select a photo, and get a Google map of the address. The Google map UI has some additional validation to it in that it checks to be sure we at least have a street and zip before trying to map it.

Communications & Notes
----------------------

Adding Communications and Notes is similar to adding Phone or Email. However, rather than a modal these get added directly to the page. Typically I would keep it consistent throughout the page but here there is less to worry about for validation (which makes it simpler to add right to the page. If we did this for phone for instance, when is it validated? Do you have to click save on each added phone on the page? Would it mean save Phone or save the whole page? That would be confusing. As would waiting for form submit to validate. Then you could end up with a bunch of errors somewhere above the user in the form. Also confusing.), and I wanted to demonstrate another useful UI pattern.

Thanks!
=======

Thank you all for the opportunity to put this together for you. If you have any questions about anything just let me know!
