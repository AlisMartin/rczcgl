package xxw.service;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.model.SharedStringsTable;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.xml.sax.*;
import org.xml.sax.helpers.DefaultHandler;
import org.xml.sax.helpers.XMLReaderFactory;
import xxw.po.Latrine;

import java.io.InputStream;
import java.util.List;

public class LatrineXlsxParser {

    public void processOneSheet(String filename, List<Latrine> latrineList) throws Exception {
        OPCPackage pkg = OPCPackage.open(filename);
        XSSFReader r = new XSSFReader(pkg);
        SharedStringsTable sst = r.getSharedStringsTable();

        XMLReader parser = fetchSheetParser(sst, latrineList);
        InputStream sheet2 = r.getSheetsData().next();
        InputSource sheetSource = new InputSource(sheet2);
        parser.parse(sheetSource);
        sheet2.close();
    }

    public XMLReader fetchSheetParser(SharedStringsTable sst, List<Latrine> latrineList) throws SAXException {
        XMLReader parser = XMLReaderFactory.createXMLReader("org.apache.xerces.parsers.SAXParser");
        ContentHandler handler = new SheetHandler(sst, latrineList);
        parser.setContentHandler(handler);
        return parser;
    }

    private static class SheetHandler extends DefaultHandler {
        private SharedStringsTable sst;
        private String lastContents;
        private boolean nextIsString;

        private String r;
        private  Latrine latrine;
        private List<Latrine> latrineList;

        private SheetHandler(SharedStringsTable sst, List<Latrine> latrineList) {
            this.sst = sst;
            this.latrineList = latrineList;
        }

        public void startElement(String uri, String localName, String name, Attributes attributes) throws SAXException {
            if (name.equals("c")) {
                r = attributes.getValue("r");
                if(r.startsWith("A")){
                    latrine = new Latrine();
                }

                String cellType = attributes.getValue("t");
                if (cellType != null && cellType.equals("s")) {
                    nextIsString = true;
                } else {
                    nextIsString = false;
                }
            }
            lastContents = "";
        }

        public void endElement(String uri, String localName, String name) throws SAXException {
            if (nextIsString) {
                int idx = Integer.parseInt(lastContents);
                lastContents = new XSSFRichTextString(sst.getEntryAt(idx)).toString().trim();
                nextIsString = false;
            }

            if (name.equals("v")) {
                if(r == null || (r.length() == 2 && r.charAt(1) == '1')) return;

                if(latrine == null) latrine = new Latrine();

                switch (r.charAt(0)){
                    case 'B':
                        latrine.setCounty(lastContents);
                        latrineList.add(latrine);
                        break;
                    case 'C':
                        latrine.setTown(lastContents);
                        break;
                    case 'D':
                        latrine.setVillage(lastContents);
                        break;
                    case 'E':
                        latrine.setName(lastContents);
                        break;
                    case 'F':
                        latrine.setIdCard(lastContents);
                        break;
                    case 'G':
                        latrine.setHouseNum(lastContents);
                        break;
                    case 'H':
                        latrine.setRenovateMode(lastContents);
                        latrine.setRenovateModeId(LatrineService.convertRenovateMode(lastContents));
                        break;
                    case 'I':
                        latrine.setRenovateDate(LatrineService.convertRenovateYear(lastContents));
                        break;
                    case 'J':
                        latrine.setTel(lastContents);
                        break;
                    case 'K':
                        latrine.setRemarks(lastContents);
                        break;
                }
            }
        }

        public void characters(char[] ch, int start, int length) throws SAXException {
            lastContents += new String(ch, start, length);
        }
    }
}


