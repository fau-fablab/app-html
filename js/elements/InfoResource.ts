class InfoResource{

    public productInfo():string{
        return "Gib das gewünschte Produkt ein und drücke auf Suchen. Wenn du alle Produkte finden willst, " +
        "dann lasse das Feld frei und suche direkt. Alternativ kannst du auf 'Erweiterte Suche' drücken um weitere Suchoptionen zu erhalten " +
        "z.B. um Produkte gezielt nach Kategorien zu suchen oder um dir alle Kategorien mit den Produkten anzeigen zu lassen.";
    }

    public cartInfo(): string{
        return "Wenn du bezahlen möchtest, generiere dir an der Kasse im FABLAB einen QR Code " +
            "und klicke hier auf den \"Zur Kasse\"-Button. Nun musst du den QR Code abtippen, auf \"Absenden\" klicken " +
            "und anschließend bequem im FABLAB bezahlen.";
    }

    public reservationInfo(): string{
        return "Wähle eine Maschine aus dem Dropdown Menü aus, " +
            "fülle anschließend die drei gegebenen Felder entsprechend aus und trage dich per Klick in die Warteliste ein. " +
            "Du sieht anschließend die aktuelle Warteschlange und deine Position. Wenn du doch nicht mehr warten willst oder keine Zeit mehr hast," +
            " trage dich bitte wieder aus indem du auf das kleine X in deiner Zeile klickst.";
    }

    public aboutInfo():string{
        return "Wählen Sie aus, was Sie melden wollen. Danach können die Formularfelder ausgefüllt werden."
    }
}
