function getResponses(url, api_key, client_id) {
    console.log(url, api_key, client_id);

    return new Promise(resolve =>
        setTimeout(
            () =>
                resolve({
                    response_count: 20, // pocet respondentov
                    nps_promoter_percentage: 65,
                    nps_detractor_percentage: 20,
                    comments_rating: [
                        'Pretože to bolo super, veľmi rozhľadený pán, dobre sa ho počúvalo.',
                        'Politika má veľký vplyv na život každého z nás a je dôležité pochopiť aká v skutočnosti môže byť.',
                    ],
                    comments_outcome: ['Že treba mať nádej', 'ĽSNS môže byť ešte nebezpečnejšie ako sa zdá.'],
                    comments_appreciation: ['Rozhľadenosť, múdrosť, skúsenosti'],
                    comments_suggestions: [
                        'Odpovede na otázky by mohli byť stručnejšie, aby sme stihli viac otázok a nemuseli by zachádzať do takých historických detailov.',
                    ],
                    comments_other: [
                        'My sme bohužiaľ kvôli záverečnej prezentácii na PVP meškali asi 20 minút a mali sme problém sa dostať do vnútra. Tak by bolo do budúcna fajn v takýchto prípadoch mať človeka na telefóne, ktorý by nám prišiel otvoriť :) (Hosť nedvíhal telefón, chápem aj to sa môže štát:) )',
                    ],
                }),
            1000,
        ),
    );
}

export default getResponses;
