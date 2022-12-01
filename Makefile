# You need https://www.minifier.org/ to be able to obtain the 
# minified versions of the css and js files.
MINI = minify

RM = rm -rf
LIB = lib
CAT = cat
SRC = src

TARGET = build

SOURCESJS = $(LIB)/js/BibTex-0.1.2.js $(LIB)/js/datatables.min.js $(SRC)/js/bib-publication-list.js
SOURCECSS = $(LIB)/css/datatables.min.css $(SRC)/css/bib-publication-list.css

all: build

clean:
	$(RM) build/*

build: $(TARGET)/bib-list.js $(TARGET)/bib-list.css

min: $(TARGET)/bib-list.min.js $(TARGET)/bib-list.min.css

$(TARGET)/bib-list.js: $(SOURCESJS)
	$(CAT) $^ > $(TARGET)/bib-list.js

$(TARGET)/bib-list.css: $(SOURCECSS)
	$(CAT) $^ > $@

$(TARGET)/bib-list.min.js: $(SOURCESJS)
	$(MINI) -o $@ $^ 

$(TARGET)/bib-list.min.css: $(SOURCECSS)
	$(MINI) -o $@ $^
