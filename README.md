**bib-publication-list to automatically generate an interactive HTML publication list from a BibTeX file**

## Demo

There are example files in the [`test/html`](test/html/) folder, please refer to them for examples and live demos.
Alternatively, you can see this plug-in live [on my website](https://aubert.perso.math.cnrs.fr/#publicatio).

## Getting Started

To use this program, you will need to 

- Include your [BibTex](https://www.bibtex.com/) references in your webpage,
- Load two javascript libraries and one css file,
- Call the program with a `<script>` element.

### Include your BibTex

Include the BibTeX into an HTML page and the `<div>` element where you want your list of references to appear.

For example:

    <div id="bib-publication-list">
        <table></table>
    </div>
    <pre id="bibtex">@article{Karavirta:JVLCTaxonomy,
       title = {A comprehensive taxonomy of algorithm animation languages},
       journal = {Journal of Visual Languages \& Computing},
       volume = {20},
       number = {1},
       pages = {1--22},
       year = {2010},
       issn = {1045-926X},
       doi = {DOI: 10.1016/j.jvlc.2009.09.001},
       author = {Ville Karavirta and Ari Korhonen and Lauri Malmi and Thomas Naps}
    }
    </pre>

The graph and the legend will be inserted just above the table. If you want to place them anywhere else in
the page, e.g. if you want to wrap your table in a container and have the graph and legend outside, you
can declare them in the HTML. The script won't insert new elements before the table and will instead use
the ones you have created.

    <div id="bib-publication-list">
        <div class="bibchart-container">
            <div class="bibchart"></div>
        </div>
        <div class="legend"></div>
        <div class="some-table-wrapper">
            <table></table>
        </div>
    </div>

### Loading the library

Load [jquery](https://releases.jquery.com/), our script, and the css file:

    <link rel="stylesheet" href="bib-list.css"/>
    ...
    <script
			  src="https://code.jquery.com/jquery-3.6.1.js"
			  integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI="
			  crossorigin="anonymous"></script>
    <script type="text/javascript" src="bib-list.js"></script>

Alternatively, you can use the compressed versions:
    
    <link rel="stylesheet" href="bib-list.min.css"/>
    ...
    <script	  src="https://code.jquery.com/jquery-3.6.1.min.js"
			  integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ="
			  crossorigin="anonymous"></script>
    <script type="text/javascript" src="bib-list.min.js"></script>

			  
### Call the script

Finally, the `bib-publication-list` needs to know the input data element and the output table. So, some JavaScript:

    <!-- Then we load our script by calling bibtexify with the correct options:
         - id of the pre element containing the bibliography,
         - id of the div element containing the table that will display the references,
         - optional arguments.
    -->
    <script type="text/javascript">
		    $(document).ready(function() {
        	bibtexify("#bibtex", "bib-publication-list", {'tweet': 'vkaravir', 'lang': 'en'});
    		});
		</script>

And _voilà_!

## Configuration Options

The bibtexify function accepts an optional third parameter for configuration options. These options include:

option | arguments
--- | ------------
visualization | A boolean to control addition of the visualization. Defaults to true.</td></tr>
<tr><td>tweet</td><td>Twitter username to add Tweet links to bib items with a url field.</td></tr>
<tr><td>sorting</td><td>Control the default sorting of the list. Defaults to `[[0, "desc"], [1, "desc"]]`. See (https://legacy.datatables.net/api#fnSort) for details on formatting.</td></tr>
<tr><td>datatable</td><td>Pass options to the datatable library used to create the table of publications. See (https://legacy.datatables.net/api) for available options.</td></tr>
<tr><td>defaultYear</td><td>Entries without a year will use this as year. Defaults to "To Appear".
</tbody>
</table>

## Building from source

There is a Makefile for building with make.
The minified version requires [minifier](https://www.minifier.org/).

There is also an (untested!) Jakefile for building the combined and minified versions with [Jake](https://github.com/mde/jake)

## Credits

This code uses some great libraries: [jQuery](http://jquery.com/), [DataTables](http://datatables.net/),
and [JavaScript BibTeX Parser](http://sourceforge.net/projects/jsbibtex/).

## History / Changelog

This is a fork of [bib-publication-list](https://github.com/GioBonvi/bib-publication-list), which is itself a fork of [bib-publication-list](https://github.com/vkaravir/bib-publication-list) that I created for personal use.

The main changes are:

- [Updated](https://github.com/aubertc/bib-publication-list/commit/96fed3ad87cec534ca327c55a44a176fbb1c5e93) [DataTables](https://datatables.net/) to 1.13.1,
- [Added support](https://github.com/aubertc/bib-publication-list/commit/4155d66a05e741443b545f0b207a51d970372d0c) for `doi` and `eprint` fields.
- Changed some styles,
- Added support for French in addition to English.

This code is _poorly documented and maintained_, use at your own risk, and feel free to open issues or to reach out by email.
You can see a demo [on my website](https://aubert.perso.math.cnrs.fr/#publicatio).

The [previous fork]](https://github.com/GioBonvi/bib-publication-list) added the following:

- More flexible HTML structure
- Use of flexbox for a more responsive behavior
- Updated build tools
  - Removed deprecated code from old node versions
  - Switched JS minifier to uglify-js to improve minification
- Some minor changes in the CSS style
- Fixed some types of BibTex content requiring fields that are not actually required by BibTex standard
- Introduced the use of "et al." for publications with more than 6 authors


## Deprecated 

It used to be the case that the bibtex could be loaded from a file.
This feature seems to be broken now, but here is what the original author wrote:

> Personally I prefer including it in the HTML,
> though. This way, browsers without JavaScript enabled get at least to see the bibtex instead of a blank page.
> This causes an ugly-looking flash of unstyled content, though.
>
>    bibtexify("example-biblist.bib", "bib-publication-list");
>
>
>If you want to fix the flash of unstyled content, you can hide the #bibtex element and make it
visible when JavaScript is disabled. To do that, add
>
>    #bibtex { display: none; }
>
> to your CSS and
> 
>     <noscript><style>#bibtex { display: block; }</style></noscript>
> 
> to your HTML.
