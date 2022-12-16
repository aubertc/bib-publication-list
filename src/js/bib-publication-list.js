var bibtexify = (function($) {
    // helper function to "compile" LaTeX special characters to HTML
    var htmlify = function(str) {
        if (!str) {
            return '';
        }
        // TODO: this is probably not a complete list..
        str = str.replace(/\\"\{a\}/g, '&auml;')
            .replace(/\{\\aa\}/g, '&aring;')
            .replace(/\\aa\{\}/g, '&aring;')
            .replace(/\\"a/g, '&auml;')
            .replace(/\\"\{o\}/g, '&ouml;')
            .replace(/\\'e/g, '&eacute;')
            .replace(/\\'\{e\}/g, '&eacute;')
            .replace(/\\'a/g, '&aacute;')
            .replace(/\\'A/g, '&Aacute;')
            .replace(/\\"o/g, '&ouml;')
            .replace(/\\"u/g, '&uuml;')
            .replace(/\\ss\{\}/g, '&szlig;')
            .replace(/\{/g, '')
            .replace(/\}/g, '')
            .replace(/\\&/g, '&')
            .replace(/--/g, '&ndash;');
        return str;
    };
    // helper functions to turn a single bibtex entry into HTML
    var bib2html = {
        // We define the required variables for French and English.
        // Some of the French translation was inspired by
        // https://datatables.net/plug-ins/i18n/French.html
        // for the tables.
        lang: {
            fr: {
                'and': 'et',
                'archived': 'Version archivée sur',
                'article': 'Journal',
                'bibtex': 'Entrée au format BibTex',
                'book': 'Book',
                'close': 'Fermer',
                'conference': '<em>Workshop</em>', // we abuse the conference type alias by making it a workshop.
                'desc': 'Description',
                'dir': 'Sous la dir. de',
                'doi': 'Identificateur d’objet numérique',
                'first': 'Première',
                'future': 'À paraître',
                'inbook': 'Book chapter',
                'incollection': '',
                'infoEmpty': 'Affichage de 0 à 0 sur 0 entrées',
                'infoFiltered': '(filtrées depuis un total de _MAX_ entrées)',
                'info': 'Affichage de _START_ à _END_ sur _TOTAL_ entrées',
                'inproceedings': 'Conférence',
                'in': 'In',
                'last': 'Dernière',
                'lengthMenu': 'Afficher _MENU_ entrées',
                'link': 'Lien',
                'manual': 'Manual',
                'mastersthesis': 'Mémoire',
                'misc': 'Divers',
                'missing': 'Manquant',
                'next': 'Suivante',
                'online': 'Cet article en ligne',
                'pdfversion': 'Version PDF',
                'phdthesis': 'Thèse',
                'previous': 'Précédente',
                'proceedings': 'Édition',
                'search': 'Rechercher :',
                'sourcetex': 'Source code LaTeX',
                'techreport': 'Rapport de recherche',
                'type': 'Type',
                'unpublished': 'Soumis',
                'year': 'Année',
                'zeroRecords': 'Aucune entrée correspondante trouvée'
            },
            en: {
                'and': 'and',
                'archived': 'Version archived on',
                'article': 'Journal',
                'bibtex' : 'This article as BibTeX',
                'book': 'Book',
                'close': 'Close',
                'conference': 'Workshop', // we abuse the conference type alias by making it a workshop.
                'desc': 'Description',
                'dir': 'Edited by',
                'doi': 'Digital Object Identifier',
                'editor': 'editor',
                'first': 'First',
                'future': 'To Appear',
                'inbook': 'Book chapter',
                'incollection': 'In Collection',
                'infoEmpty': 'No records available',
                'infoFiltered': '(filtered from _MAX_ total records)',
                'info': 'Showing page _PAGE_ of _PAGES_',
                'inproceedings': 'Conference',
                'in': 'In',
                'last': 'Last',
                'lengthMenu': 'Show _MENU_ entries',
                'link' : 'link',
                'manual': 'Manual',
                'mastersthesis': 'Thesis',
                'misc': 'Misc',
                'missing': 'Missing',
                'next': 'Next',
                'online': 'This article online',
                'pdfversion': 'PDF version',
                'phdthesis': 'PhD Thesis',
                'previous': 'Previous',
                'proceedings': 'Conference proceeding',
                'search': 'Search:',
                'sourcetex': 'Latex source code',
                'techreport': 'Technical report',
                'type': 'Type',
                'unpublished': 'Unpublished',
                'year': 'Year',
                'zeroRecords': 'Nothing found - sorry'
            }
        },
        // the main function which turns the entry into HTML
        entry2html: function(entryData, bib) {
            // We begin by fixing the lang value to the appropriate language:
            if (bib.options.lang == 'fr') {
                lang = bib2html.lang.fr;
            } else if (bib.options.lang == 'en') {
                lang = bib2html.lang.en;
            } else {
                alert("This language is not supported yet. Defaulting to English.");
                lang = bib2html.lang.en;
            }
            var type = entryData.entryType.toLowerCase();
            // default to type misc if type is unknown
            if (array_keys(bib2html).indexOf(type) === -1) {
                type = 'misc';
                entryData.entryType = type;
            }
            var itemStr = htmlify(bib2html[type](entryData));
            itemStr += bib2html.links(entryData);
            itemStr += bib2html.bibtex(entryData);
            return itemStr.replace(/undefined[,.]?/g,
                '<span class="undefined">' + lang.missing + '<\/span>');
        },

        // converts the given author data into HTML
        authors2html: function(authorData) {
            var authorsStr = '';
            var author;
            if (!authorData) {
                return authorsStr;
            }
            if (authorData.length > 6) {
                author = authorData[0];
                authorsStr += author.first +
                    (author.von ? ' ' + author.von + ' ' : ' ') +
                    author.last +
                    " et al";
            } else {
                for (var index = 0; index < authorData.length; index++) {
                    if (index > 0) {
                        if (index == authorData.length - 1) // If we are at the last author
                        {
                            authorsStr += " " + lang.and + " ";
                        } else { // Otherwise we just add a coma
                            authorsStr += ", ";
                        }
                    }
                    author = authorData[index];
                    authorsStr += author.first +
                        (author.von ? ' ' + author.von + ' ' : ' ') +
                        author.last;
                }
            }
            return htmlify(authorsStr);
        },
        // adds links to the PDF or url of the item
        links: function(entryData) {
            var itemStr = '<br/>';
            if (entryData.url && entryData.url.match(/.*\.pdf/)) {
                itemStr += ' (<a title="' + lang.pdfversion + '." href="' +
                    entryData.url + '" style="white-space: nowrap"><i class="fa fa-file-pdf fa-fw" style="color:red" aria-hidden="true"></i>pdf<\/a>)';
            } else if (entryData.url) {
                itemStr += ' (<a title="' + lang.online + '"  href="' + entryData.url +
                    '" style="white-space: nowrap"><i class="fa fa-external-link fa-fw" style="color:blue" aria-hidden="true"></i>' + lang.link + '<\/a>)';
            }
            if (entryData.doi) {
                itemStr += ' (<a title="' + lang.doi + '." href="http://dx.doi.org/' +
                    entryData.doi + '" style="white-space: nowrap"><i class="ai ai-doi" style="color:#fab222" aria-hidden="true"></i>doi<\/a>)';
            }
            if (entryData.archiveprefix) {
                if (entryData.eprint) {
                    var archiveurl = '';
                    var archivelogo = '';
                    if (entryData.archiveprefix == "arXiv") {
                        archiveurl = 'http://arxiv.org/abs/';
                        archivelogo = 'ai ai-arxiv" style="background-color:#02f702"';
                    }
                    else if (entryData.archiveprefix == "tel") {
                        archiveurl = 'https://tel.archives-ouvertes.fr/';
                        archivelogo = 'ai ai-hal" style="color:#cd3c1b"'; // I am not aware of a particular logo for tel that is different from the logo of hal.
                    }
                    else if (entryData.archiveprefix == "hal") {
                        archiveurl = 'https://hal.archives-ouvertes.fr/';
                        archivelogo = 'ai ai-hal" style="color:#cd3c1b"';
                    }
                    else if (entryData.archiveprefix == "handle") {
                        archiveurl = 'https://hdl.handle.net/';
                    }
                    itemStr += ' (<a title="' + lang.archived + ' ' + entryData.archiveprefix + '." href="' + archiveurl + 
                        entryData.eprint + '" style="white-space: nowrap">' + (archivelogo ? '<i class="' + archivelogo + '" aria-hidden="true"></i>': '') + entryData.archiveprefix + '<\/a>)';
                }
            }
            if (entryData.file) {
                itemStr += ' (<a title=' + lang.sourcetex + ' href="' + entryData.file + '" style="white-space: nowrap"><i class="fa fa-code" aria-hidden="true" style="color: black"></i>source<\/a>)';
            }
            return itemStr;
        },
        // adds the bibtex link and the opening div with bibtex content
        bibtex: function(entryData) {
            var itemStr = '';
            itemStr += ' (<a title="' + lang.bibtex + '" href="#" class="biblink" style="white-space: nowrap"><i class="fa fa-file-text fa-fw" style="color:green" aria-hidden="true"></i>' +
                'bib</a>)<div class="bibinfo hidden">';
            itemStr += '<a href="#" class="bibclose" title="' + lang.close + '">⨯</a><pre>';
            itemStr += '@' + entryData.entryType + "{" + entryData.cite + ",\n";
            $.each(entryData, function(key, value) {
                if (key == 'author') {
                    itemStr += '  author = {';
                    for (var index = 0; index < value.length; index++) {
                        if (index > 0) {
                            itemStr += " and ";
                        }
                        itemStr +=  (value[index].von ? ' ' + value[index].von + ' ' : '') +
                            value[index].last +  (value[index].first ?  ", "+ value[index].first : '');                  
                    }
                    itemStr += '},\n';
                } else if (key == 'editor') {
                    itemStr += '  editor = {';
                    for (var index = 0; index < value.length; index++) {
                        if (index > 0) {
                            itemStr += " and ";
                        }
                        itemStr +=  (value[index].von ? ' ' + value[index].von + ' ' : '') +
                            value[index].last +  (value[index].first ?  ", "+ value[index].first : '');                  
                        
                    }
                    itemStr += '},\n';
                } else if (key != 'entryType' && key != 'cite') {
                    itemStr += '  ' + key + " = {" + value + "},\n";
                }
            });
            itemStr += "}</pre></div>";
            return itemStr;
        },
        // helper functions for formatting different types of bibtex entries
        inproceedings: function(entryData) {
            return this.authors2html(entryData.author) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                lang.in + ": <em>" + entryData.booktitle + "</em>. " +
                ((entryData.editor) ? lang.dir + " " + this.authors2html(entryData.editor) + ". " : "") + 
                ((entryData.publisher) ? htmlify(entryData.publisher) : "") +
                ((entryData.publisher)? ((entryData.pages)? ", " : "."):"") + 
                ((entryData.pages) ? "pp.&nbsp;" + entryData.pages : "") +
                ((entryData.address) ? ", " + entryData.address + ".": "") +
                "<\/em>";
        },
        incollection: function(entryData) {
            return this.authors2html(entryData.author) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                +lang.in + ": " +
                ((entryData.editor) ? "" + this.authors2html(entryData.editor) + ", " + lang.editor + ", " : "") +
                "<em>" + entryData.booktitle +
                ((entryData.pages) ? ", pp.&nbsp;" + entryData.pages : "") +
                ((entryData.address) ? ", " + entryData.address : "") + ".<\/em>";
        },
        article: function(entryData) {
            return this.authors2html(entryData.author) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                lang.in + ": <em>" + entryData.journal +
                ((entryData.volume) ? ", " + entryData.volume : "") + 
                ((entryData.number) ? "(" + entryData.number + ")" : "") +
                ((entryData.pages) ? ", pp.&nbsp;" + entryData.pages + "." : "") +
                ((entryData.address) ? entryData.address + "." : "") + "<\/em>";
        },
        misc: function(entryData) {
            return this.authors2html(entryData.author) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                ((entryData.howpublished) ? entryData.howpublished + ". " : "") +
                ((entryData.note) ? entryData.note + "." : "");
        },
        mastersthesis: function(entryData) {
            return this.authors2html(entryData.author) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                entryData.type + ". " +
                ((entryData.organization) ? entryData.organization + ", " : "") + entryData.school + ".";
        },
        techreport: function(entryData) {
            return this.authors2html(entryData.author) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                entryData.institution + ". " +
                ((entryData.number) ? entryData.number + ". " : "") +
                ((entryData.type) ? entryData.type + "." : "");
        },
        book: function(entryData) {
            return this.authors2html(entryData.author || entryData.editor) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                entryData.publisher +
                ((entryData.issn) ? ", ISBN: " + entryData.issn + "." : ".");
        },
        inbook: function(entryData) {
            return this.authors2html(entryData.author) + ".<br>" +
                "<strong id=\"" + entryData.cite + "\">" + entryData.chapter + "</strong>.<br/>" +
                lang.in + " <em>" + entryData.title + "<\/em>, " +
                ((entryData.editor) ? " " + lang.dir + " " + this.authors2html(entryData.editor) + ", " : "") +
                entryData.publisher +
                ((entryData.pages) ? ", pp.&nbsp;" + entryData.pages : "") +
                ((entryData.series) ? ", <em>" + entryData.series + "<\/em>" : "") +
                ((entryData.volume) ? ", Vol.&nbsp;" + entryData.volume  : "") +
                ((entryData.issn) ? ", ISBN: " + entryData.issn  : "") +
                ".";
        },
        proceedings: function(entryData) {
            return ((entryData.editor) ?
                    ((lang.dir) ? lang.dir + " " : "") +
                    this.authors2html(entryData.editor) +
                    ((lang.editor) ? lang.editor : "") : "") + "<br>" +
                    "<strong id=\"" +  entryData.cite + "\">" + entryData.title + "</strong>.<br/>" +
                    ((entryData.volume) ? "T. " + entryData.volume + "." : "") +
                    ((entryData.series) ? " " + entryData.series  : "") +
                    ((entryData.address) ? ", " + entryData.address : "") + ". " +
                    ((entryData.organization) ? +entryData.organization : "") +
                    ((entryData.organization && entryData.publisher) ? ", " : "") +
                    (entryData.publisher ? entryData.publisher + ". " : "") +
                    (entryData.note ? entryData.note : "");
        },

        // weights of the different types of entries; used when sorting
        importance: {
            'TITLE': 9999,
            'unpublished': 0,
            'misc': 0,
            'manual': 10,
            'techreport': 20,
            'mastersthesis': 30,
            'phdthesis': 40,
            'conference': 50,
            'incollection': 60,
            'inproceedings': 70,
            'proceedings': 80,
            'article': 90,
            'inbook': 100,
            'book': 110
        } // Conference is used for workshops, so their weight is lighter than inproceedings, which is used for conferences.
    };
    // format a phd thesis like a  masters thesis
    bib2html.phdthesis = bib2html.mastersthesis;
    // conference is the same as inproceedings
    // but is counted differently
    bib2html.conference = bib2html.inproceedings;

    // event handlers for the bibtex links
    var EventHandlers = {
        showbib: function showbib(event) {
            $(this).next(".bibinfo").removeClass('hidden').addClass("open");
            $("#shutter").show();
            event.preventDefault();
        },
        hidebib: function hidebib(event) {
            $("#shutter").hide();
            $(".bibinfo.open").removeClass("open").addClass("hidden");
            event.preventDefault();
        }
    };

    var Bib2HTML = function(data, bibElemId, $pubTable, options) {
        this.options = options;
        this.bibElemId = bibElemId;
        this.$pubTable = $pubTable;
        this.stats = {};
        this.initialize(data);
    };
    var bibproto = Bib2HTML.prototype;
    bibproto.initialize = function initialize(data) {
        var bibtex = new BibTex();
        bibtex.content = data;
        bibtex.parse();
        var bibentries = [],
            len = bibtex.data.length;
        var entryTypes = {};
        jQuery.extend(true, bib2html, this.options.bib2html);
        for (var index = 0; index < len; index++) {
            var item = bibtex.data[index];
            if (!item.year) {
                if(this.options.defaultYear){item.year = this.options.defaultYear;}
                else{
                    if (this.options.lang == 'fr') {
                        item.year = bib2html.lang.fr.future;
                    } else if (this.options.lang == 'en') {
                        item.year = bib2html.lang.en.future;
                    } else {
                        alert("This language is not supported yet. Defaulting to English.");
                        item.year = bib2html.lang.en.future;
                    }
                }   
            }
            try {
                var html = bib2html.entry2html(item, this);
                bibentries.push([item.year, lang[item.entryType], html]);
                entryTypes[lang[item.entryType]] = item.entryType;
                this.updateStats(item);
            } catch (e) {
                console.error('Failed to process entry: ', item);
            }
        }
        jQuery.fn.dataTableExt.oSort['type-sort-asc'] = function(x, y) {
            var item1 = bib2html.importance[entryTypes[x]],
                item2 = bib2html.importance[entryTypes[y]];
            return ((item1 < item2) ? -1 : ((item1 > item2) ? 1 : 0));
        };
        jQuery.fn.dataTableExt.oSort['type-sort-desc'] = function(x, y) {
            var item1 = bib2html.importance[entryTypes[x]],
                item2 = bib2html.importance[entryTypes[y]];
            return ((item1 < item2) ? 1 : ((item1 > item2) ? -1 : 0));
        };
        var table = this.$pubTable.dataTable($.extend({
            'aaData': bibentries,
            'aaSorting': this.options.sorting,
            'aoColumns': [{
                "sTitle": lang.year
            }, {
                "sTitle": "Type",
                "sType": "type-sort",
                "asSorting": ["desc", "asc"]
            }, {
                "sTitle": lang.desc,
                "bSortable": false
            }],
            'language': {
                "search": lang.search,
                "zeroRecords": lang.zeroRecords,
                "info": lang.info,
                "infoEmpty": lang.infoEmpty,
                "infoFiltered": lang.infoFiltered,
                 "paginate": {
        "first": lang.first,
        "last": lang.last,
        "next": lang.next,
        "previous": lang.previous
    },
        "lengthMenu": lang.lengthMenu
            }
        }, this.options.datatable));
        if (this.options.visualization) {
            this.addBarChart();
        }
        $("th", this.$pubTable).unbind("click").click(function(e) {
            var $this = $(this),
                $thElems = $this.parent().find("th"),
                index = $thElems.index($this);
            if ($this.hasClass("sorting_disabled")) {
                return;
            }
            $this.toggleClass("sorting_asc").toggleClass("sorting_desc");

            if (index === 0) {
                table.fnSort([
                    [0, $thElems.eq(0).hasClass("sorting_asc") ? "asc" : "desc"],
                    [1, $thElems.eq(1).hasClass("sorting_asc") ? "asc" : "desc"]
                ]);
            } else {
                table.fnSort([
                    [1, $thElems.eq(1).hasClass("sorting_asc") ? "asc" : "desc"],
                    [0, $thElems.eq(0).hasClass("sorting_asc") ? "asc" : "desc"]
                ]);
            }
        });
        // attach the event handlers to the bib items
        $(".biblink", this.$pubTable).on('click', EventHandlers.showbib);
        $(".bibclose", this.$pubTable).on('click', EventHandlers.hidebib);
    };
    // updates the stats, called whenever a new bibtex entry is parsed
    bibproto.updateStats = function updateStats(item) {
        if (!this.stats[item.year]) {
            this.stats[item.year] = {
                'count': 1,
                'types': {}
            };
            this.stats[item.year].types[item.entryType] = 1;
        } else {
            this.stats[item.year].count += 1;
            if (this.stats[item.year].types[item.entryType]) {
                this.stats[item.year].types[item.entryType] += 1;
            } else {
                this.stats[item.year].types[item.entryType] = 1;
            }
        }
    };
    // adds the barchart of year and publication types
    bibproto.addBarChart = function addBarChart() {
        var yearstats = [];
        var maxItems = 0;
        var maxTypes = 0;
        $.each(this.stats, function(key, value) {
            var types = [];
            $.each(value.types, function(type) {
                types.push(type);
            });
            types.sort(function(x, y) {
                return bib2html.importance[y] - bib2html.importance[x];
            });

            yearstats.push({
                'year': key,
                'count': value.count,
                'item': value,
                'types': value.types,
                typeArr: types
            });
            maxItems = Math.max(maxItems, value.count);
            maxTypes = Math.max(maxTypes, types.length);
        });
        var isTypeMode = maxItems > 15;
        yearstats.sort(function(a, b) {
            var diff = a.year - b.year;
            if (!isNaN(diff)) {
                return diff;
            } else if (a.year < b.year) {
                return -1;
            } else if (a.year > b.year) {
                return 1;
            }
            return 0;
        });
        var chartSelector = '#' + this.bibElemId + ' .bibchart';
        var legendSelector = '#' + this.bibElemId + ' .legend';
        var legendTypes = [];
        var stats2html = function(item) {
            var types = item.typeArr;
            var str = '<div class="year">';
            var itemStr = '<br/>';
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                if (legendTypes.indexOf(type) === -1) {
                    legendTypes.push(type);
                }
                if (isTypeMode) {
                    // just one block for publication type
                    itemStr += '<div class="pub ' + type + '"></div>';
                } else {
                    // one block for each entry of the publication type
                    for (var j = 0; j < item.types[type]; j++) {
                        itemStr += '<div class="pub ' + type + '"></div>';
                    }
                }
            }
            str += itemStr;

            return str + '<div class="yearlabel">' + item.year + '</div></div>';
        };
        var statsHtml = '';
        yearstats.forEach(function(item) {
            statsHtml += stats2html(item);
        });
        var legendHtml = '';
        for (var i = 0, l = legendTypes.length; i < l; i++) {
            var legend = legendTypes[i];
            legendHtml += '<div><span class="pub ' + legend + '"></span>' + lang[legend] + '</div>';
        }
        $(chartSelector).html(statsHtml)
        if ($(legendSelector).length === 0) {
            $(chartSelector).after('<div class="legend"></div>');
        }
        $(legendSelector).html(legendHtml);
    };

    // Creates a new publication list to the HTML element with ID
    // bibElemId. The bibsrc can be
    //   - a jQuery selector, in which case html of the element is used
    //     as the bibtex data
    //   - a URL, which is loaded and used as data. Note, that same-origin
    //     policy restricts where you can load the data.
    // Supported options:
    //   - visualization: A boolean to control addition of the visualization.
    //                    Defaults to true.
     //   - sorting: Control the default sorting of the list. Defaults to [[0, "desc"],
    //              [1, "desc"]]. See http://datatables.net/api fnSort for details
    //              on formatting.
    //   - bib2html: Can be used to override any of the functions or properties of
    //               the bib2html object. See above, starting around line 40.
    //   - lang : Used to specify language. Now support "fr" and "en", for French
    //            and English (default).
    return function(bibsrc, bibElemId, opts) {
        var options = $.extend({}, {
                'visualization': true,
                'sorting': [
                    [0, "desc"],
                    [1, "desc"]
                ],
                'lang': 'en'
            },
            opts);
        var $pubTable = $("#" + bibElemId + " table").addClass("bibtable").addClass("display");
        if ($("#shutter").length === 0) {
            $pubTable.before('<div id="shutter" class="hidden"></div>');
            $("#shutter").click(EventHandlers.hidebib);
        }
        if (options.visualization && $("#" + bibElemId + " .bibchart").length === 0) {
            $pubTable.before('<div class="bibchart-container"><div class="bibchart"></div></div><div class="legend"></div>');
        } else if (!options.visualization && $("#" + bibElemId + " .bibchart").length > 0) {
            $("#" + bibElemId + " .bibchart")[0].remove();
        }
        var $bibSrc;
        if (bibsrc.indexOf('/') === -1) {
            $bibSrc = $(bibsrc);
        }
        if ($bibSrc && $bibSrc.length) { // we found an element, use its HTML as bibtex
            new Bib2HTML($bibSrc.html(), bibElemId, $pubTable, options);
            $bibSrc.hide();
        } else { // otherwise we assume it is a URL
            var callbackHandler = function(data) {
                new Bib2HTML(data, $pubTable, options);
            };
            $.get(bibsrc, callbackHandler, "text");
        }
    };
})(jQuery);
