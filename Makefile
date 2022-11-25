RM = rm -rf
LIB = lib
CAT = cat
SRC = src
TARGET = build
SOURCES = $(LIB)/BibTex-0.1.2.js $(LIB)/datatables.min.js $(SRC)/bib-publication-list.js

all: build

clean:
	$(RM) build/*

build: $(TARGET)/bib-list.js

$(TARGET)/bib-list.js: $(SOURCES)
	mkdir -p $(TARGET)
	$(CAT) $(SOURCES) > $(TARGET)/bib-list.js

