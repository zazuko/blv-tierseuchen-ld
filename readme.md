# BLV Tierseuchen RDF Pipeline

Tagesaktuelle Daten vom [Bundesamt für Lebensmittelsicherheit und Veterinärwesen](https://www.blv.admin.ch/) zu Tierseuchen werden durch diese Pipeline nach RDF überführt.

Die Pipeline baut dabei auf das für das Bundesarchiv entwickelte, generische [Pipelining-System](https://github.com/zazuko/barnard59) auf. Details zu dem System können der entsprechenden Dokumentation entnommen werden. Das System ist vollständig als Open Source Software verfügbar und kann einfach auf Unix ähnlichen Systemen (Linux, MacOS, [Windows mit WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install)) installiert und verwendet werden.

## Installation

Um die Pipeline selber ausführen zu können, sind folgende Voraussetzungen zu erfüllen:

* Installierte [Node.js](https://nodejs.org) Umgebung, ab Version 12.x
* [Apache Jena](https://jena.apache.org/) TDB, enthalten im Paket *Apache Jena*. Die [TDB Command line utilities](https://jena.apache.org/documentation/tdb/index.html) müssen im Pfad erreichbar sein.
* Zugangsdaten als Environment-Variablen
  * Zugangsdaten für den sftp-share der Datenanlieferung 
  * Zugangsdaten für den SPARQL-Endpunkt von LINDAS um die Daten zu schreiben

Die Pipeline kann auch in einem [vorkonfigurierten Docker-Container](https://hub.docker.com/r/zazukoians/node-java-jena/) verwendet werden. Dieser Container enthält sämtliche benötigten Werkzeuge und Umgebungen.

### Ausführen der Pipeline

Wenn Node.js & Apache installiert ist, können die Abhängigkeiten installiert werden: `npm install`

Nach dem installieren der Abhängigkeiten kann die Pipeline in verschiedenen Konfigurationen gestartet werden, die verschiedenen Variationen können durch `npm run` ausgegeben werden.

Bei lokalen Tests sollte die Pipeline mit dem Namen `animalpest-pipeline-file` ausgeführt werden:

```
npm run animalpest-pipeline-file
```

In dieser Konfiguration werden die Daten als RDF (N-Triples) in eine Datei auf dem lokalen Dateisystem geschrieben.

Die produktive Pipeline wird in einer privaten GitLab Umgebung als [CI/CD Job](https://docs.gitlab.com/ee/ci/README.html) ausgeführt, welche die entsprechenden Passwörter für die Zugänge zur Verfügung stellt. Dazu wird der oben verlinkte Docker-Container verwendet und GitLab über die [.gitlab-ci.yml](.gitlab-ci.yml) Datei gestartet.

Die tägliche Ausführung wird über [GitLab Pipeline Schedules](https://docs.gitlab.com/ce/user/project/pipelines/schedules.html) verwaltet, welche den GitLab CI/CD Job startet.

## Implementation der Pipeline

Die Pipeline besteht aus folgenden Schritten:

* Laden der Daten vom sftp Server: Die tagesaktuellen Daten werden von einem sftp Server geladen. Dies bedingt einen gültigen SSH-Schlüssel für diesen Server auf dem lokalen System.
* Entpacken der Daten in ein temporäres Verzeichnis.
* Konvertieren jeder einzelnen CSV Datei nach RDF, über die *CSV on the Web* Mapping Dateien im Ordner [metadata](metadata). [CSV on the Web](https://www.w3.org/TR/tabular-data-primer/) ist ein vom W3C definierter Standard.
* Bei der Konvertierung werden unter anderem folgende Arbeiten erledigt:
  * Kantone werden wie in RDF typisch als URIs gepflegt und nicht als Strings. Sie verweisen auf die Kantone im historisierten Gemeindeverzeichnis.
  * Der Datensatz vom BLV enthält genaue Koordinaten des Ortes, wo die Meldung gemacht wurde, welche nicht veröffentlicht werden darf. Dies wird über die Geo API von Swisstopo anonymisiert, indem die Koordinaten durch die Gemeinde ersetzt werden, auch wieder als Verweis auf das historisierte Gemeindeverzeichnis. Dies passiert durch Code in der Datei [lib/municipality-lookup.js](lib/municipality-lookup.js). der Nachteil dieser Methode ist die Geschwindigkeit: Aktuell dauert dies für den vollständigen Datensatz zwischen 4-5 Stunden. Ohne diesen Schritt wäre die Pipeline auf einem modernen System in wenigen Minuten fertig.
  * Da in einigen Kategorie-Daten (oder Dimensions-Tabellen) eindeutige Keys fehlen, generiert die Pipeline für diese Felder sprechende Namen (im Jargon *slug* genannt) auf Basis der englischen Bezeichnung.
  * Einige weitere, unnötige Datenfelder werden entfernt.
* Damit der Datensatz einfach abgefragt werden kann, werden die aktuellen Namen der Gemeinde durch das historisierte Gemeindeverzeichnis integriert. Nicht mehr existierende Gemeindenamen (Fusionen etc) werden durch den aktuellen Namen der neusten Gemeinde ersetzt.
* Die Namen der Kantone werden ebenfalls durch das historisierte Gemeindeverzeichnis in die Daten integriert.
* Nun werden für den ganzen Datensatz die noch fehlenden Metadaten generiert. Dies stellt sicher, dass die Daten über die [Abfrage-API](https://github.com/zazuko/query-rdf-data-cube) welche für das BAFU entwickelt wurde abgefragt werden kann.
* Als letzter Schritt werden die Daten in den SPARQL Endpunkt von LINDAS geschrieben. Bestehende Daten vom Vortag werden dabei ersetzt.

 