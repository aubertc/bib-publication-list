# bib-publication-list

This is a fork of [bib-publication-list](https://github.com/GioBonvi/bib-publication-list), which is itself a fork of [bib-publication-list](https://github.com/vkaravir/bib-publication-list) that I created for personal use.

The main changes are:

- [Updated](https://github.com/aubertc/bib-publication-list/commit/96fed3ad87cec534ca327c55a44a176fbb1c5e93) [DataTables](https://datatables.net/) to 1.13.1,
- [Added support](https://github.com/aubertc/bib-publication-list/commit/4155d66a05e741443b545f0b207a51d970372d0c) for `doi` and `eprint` fields.
- Changed some styles,
- Translated some text to French :-)

# Previous fork


The main changes are:

- More flexible HTML structure
- Use of flexbox for a more responsive behavior
- Updated build tools
  - Removed deprecated code from old node versions
  - Switched JS minifier to uglify-js to improve minification
- Some minor changes in the CSS style
- Fixed some types of BibTex content requiring fields that are not actually required by BibTex standard
- Introduced the use of "et al." for publications with more than 6 authors

**bib-publication-list to automatically generate an interactive HTML publication list from a BibTeX file**

## Getting Started

First, load the required JavaScript files:

    <script src="jquery.min.js"></script>
    <script src="bib-list-min.js"></script>

Include the CSS:

    <link rel="stylesheet" href="bib-publication-list.css" type="text/css" />

All you need to do is to include the BibTeX into an HTML page and tell the script to turn it
into a sortable and searchable table. For example:

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

Finally, the bib-publication-list needs to know the input data element and the output table. So, one
line of JavaScript:

    bibtexify("#bibtex", "bib-publication-list");

Alternatively, the bibtex can be loaded from a file. Personally I prefer including it in the HTML,
though. This way, browsers without JavaScript enabled get at least to see the bibtex instead of a blank page.
This causes an ugly-looking flash of unstyled content, though.

    bibtexify("example-biblist.bib", "bib-publication-list");

The result looks like my publication list at: http://villekaravirta.com/publications/.

If you want to fix the flash of unstyled content, you can hide the #bibtex element and make it
visible when JavaScript is disabled. To do that, add

    #bibtex { display: none; }

to your CSS and

    <noscript><style>#bibtex { display: block; }</style></noscript>

to your HTML.

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

## Configuration Options

The bibtexify function accepts an optional third parameter for configuration options. These options include:

<table>
<tbody>
<tr><td>visualization</td><td>A boolean to control addition of the visualization. Defaults to true.</td></tr>
<tr><td>tweet</td><td>Twitter username to add Tweet links to bib items with a url field.</td></tr>
<tr><td>sorting</td><td>Control the default sorting of the list. Defaults to `[[0, "desc"], [1, "desc"]]`. See (https://legacy.datatables.net/api#fnSort) for details on formatting.</td></tr>
<tr><td>datatable</td><td>Pass options to the datatable library used to create the table of publications. See (https://legacy.datatables.net/api) for available options.</td></tr>
<tr><td>defaultYear</td><td>Entries without a year will use this as year. Defaults to "To Appear".
</tbody>
</table>

## Building from source

There is a Jakefile for building the combined and minified versions with [Jake](https://github.com/mde/jake)
and a Makefile for building with make.


## Credits

This code uses some great libraries: [jQuery](http://jquery.com/), [DataTables](http://datatables.net/),
and [JavaScript BibTeX Parser](http://sourceforge.net/projects/jsbibtex/).
