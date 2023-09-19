const api = {
  requestURL: "/geoparsing-date-filter",
  post: {
    payload: {
      dates: ["2022-01-12", "2022-01-20"],
      datasetMode: "newspaper",
    },
    response: {
      features: [
        {
          geometry: {
            coordinates: [9.9987, 53.5521],
            type: "Point",
          },
          properties: {
            ID: 40,
            date: "2022-01-13",
            id: 40,
            lat: 53.5521,
            lon: 9.9987,
            title:
              "Nach_Hausarrest_Russland_lässt_Regisseur_Kirill_Serebrennikow_nach_Hamburg_reisen",
            url: "https://newsletterversand.zeit.de/go/2/4S7J9RIB-4S6SS4JA-45MD5DQS-WA7YVO-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_13.01.2022.nl_ref.zeitde.bildtext.link.20220113&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_202",
            word: "thalia theater",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9823, 53.5441],
            type: "Point",
          },
          properties: {
            ID: 41,
            date: "2022-01-14",
            id: 41,
            lat: 53.5441,
            lon: 9.9823,
            title: "Rekordinzidenz_ja_aber",
            url: "https://newsletterversand.zeit.de/go/11/4S9HVY52-4S95HZVR-45MD5DQS-HEC18RD-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_14_01_2022.nl_ref.zeitde.bildtext.link.20220114&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_2",
            word: "baumwall",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9154, 53.5638],
            type: "Point",
          },
          properties: {
            ID: 42,
            date: "2022-01-14",
            id: 42,
            lat: 53.5638,
            lon: 9.9154,
            title: "Rekordinzidenz_ja_aber",
            url: "https://newsletterversand.zeit.de/go/11/4S9HVY52-4S95HZVR-45MD5DQS-HEC18RD-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_14_01_2022.nl_ref.zeitde.bildtext.link.20220114&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_2",
            word: "großstadtrevier",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9346, 53.5522],
            type: "Point",
          },
          properties: {
            ID: 43,
            date: "2022-01-14",
            id: 43,
            lat: 53.5522,
            lon: 9.9346,
            title: "Rekordinzidenz_ja_aber",
            url: "https://newsletterversand.zeit.de/go/11/4S9HVY52-4S95HZVR-45MD5DQS-HEC18RD-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_14_01_2022.nl_ref.zeitde.bildtext.link.20220114&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_2",
            word: "altona",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9731, 53.5451],
            type: "Point",
          },
          properties: {
            ID: 44,
            date: "2022-01-14",
            id: 44,
            lat: 53.5451,
            lon: 9.9731,
            title: "Rekordinzidenz_ja_aber",
            url: "https://newsletterversand.zeit.de/go/11/4S9HVY52-4S95HZVR-45MD5DQS-HEC18RD-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_14_01_2022.nl_ref.zeitde.bildtext.link.20220114&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_2",
            word: "Jan-fedder-promenade",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9346, 53.5522],
            type: "Point",
          },
          properties: {
            ID: 45,
            date: "2022-01-17",
            id: 45,
            lat: 53.5522,
            lon: 9.9346,
            title: "Hier_wächst_das_große_Geld",
            url: "https://newsletterversand.zeit.de/go/4/4SDYL069-4S94WML5-45MD5DQS-6O36SQ-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_17_01_2022.nl_ref.zeitde.bildtext.link.20220117&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_202",
            word: "altona",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [10.0449, 53.5874],
            type: "Point",
          },
          properties: {
            ID: 46,
            date: "2022-01-17",
            id: 46,
            lat: 53.5874,
            lon: 10.0449,
            title: "Hier_wächst_das_große_Geld",
            url: "https://newsletterversand.zeit.de/go/4/4SDYL069-4S94WML5-45MD5DQS-6O36SQ-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_17_01_2022.nl_ref.zeitde.bildtext.link.20220117&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_202",
            word: "barmbek",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [10.003, 53.5553],
            type: "Point",
          },
          properties: {
            ID: 47,
            date: "2022-01-17",
            id: 47,
            lat: 53.5553,
            lon: 10.003,
            title: "Hier_wächst_das_große_Geld",
            url: "https://newsletterversand.zeit.de/go/4/4SDYL069-4S94WML5-45MD5DQS-6O36SQ-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_17_01_2022.nl_ref.zeitde.bildtext.link.20220117&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_202",
            word: "hamburger kunsthalle",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9594, 53.5539],
            type: "Point",
          },
          properties: {
            ID: 48,
            date: "2022-01-17",
            id: 48,
            lat: 53.5539,
            lon: 9.9594,
            title: "Hier_wächst_das_große_Geld",
            url: "https://newsletterversand.zeit.de/go/4/4SDYL069-4S94WML5-45MD5DQS-6O36SQ-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_17_01_2022.nl_ref.zeitde.bildtext.link.20220117&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_202",
            word: "st pauli",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [10.0127, 53.5715],
            type: "Point",
          },
          properties: {
            ID: 49,
            date: "2022-01-17",
            id: 49,
            lat: 53.5715,
            lon: 10.0127,
            title: "Hier_wächst_das_große_Geld",
            url: "https://newsletterversand.zeit.de/go/4/4SDYL069-4S94WML5-45MD5DQS-6O36SQ-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_17_01_2022.nl_ref.zeitde.bildtext.link.20220117&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_202",
            word: "uhlenhorst",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9529, 53.5583],
            type: "Point",
          },
          properties: {
            ID: 50,
            date: "2022-01-17",
            id: 50,
            lat: 53.5583,
            lon: 9.9529,
            title: "Hier_wächst_das_große_Geld",
            url: "https://newsletterversand.zeit.de/go/4/4SDYL069-4S94WML5-45MD5DQS-6O36SQ-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_17_01_2022.nl_ref.zeitde.bildtext.link.20220117&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_202",
            word: "wohlerspark",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.9958, 53.5429],
            type: "Point",
          },
          properties: {
            ID: 51,
            date: "2022-01-18",
            id: 51,
            lat: 53.5429,
            lon: 9.9958,
            title:
              "Was_sich_im_Umgang_mit_psychisch_kranken_Häftlingen_ändern_muss",
            url: "https://newsletterversand.zeit.de/go/4/4SFJSSQE-4SE25L1Z-45MD5DQS-HGQ1DW0-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_18_01_2022.nl_ref.zeitde.bildtext.link.20220118&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_20",
            word: "Hafencity",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [10.1579, 53.4708],
            type: "Point",
          },
          properties: {
            ID: 52,
            date: "2022-01-19",
            id: 52,
            lat: 53.4708,
            lon: 10.1579,
            title: "Die_Rache_der_Möwen",
            url: "https://newsletterversand.zeit.de/go/16/4SHP3VA2-4SH2E50D-45MD5DQS-18RM12QT-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_19_01_2022.nl_ref.zeitde.bildtext.link.20220119&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_",
            word: "Dove-elbe",
          },
          type: "Feature",
        },
        {
          geometry: {
            coordinates: [9.8585, 53.5309],
            type: "Point",
          },
          properties: {
            ID: 53,
            date: "2022-01-19",
            id: 53,
            lat: 53.5309,
            lon: 9.8585,
            title: "Die_Rache_der_Möwen",
            url: "https://newsletterversand.zeit.de/go/16/4SHP3VA2-4SH2E50D-45MD5DQS-18RM12QT-o.html?wt_zmc=nl.int.zonaudev.zeitverlag_hamburg_elbvertiefung_19_01_2022.nl_ref.zeitde.bildtext.link.20220119&utm_medium=nl&utm_campaign=nl_ref&utm_content=zeitde_bildtext_link_",
            word: "finkenwerder",
          },
          type: "Feature",
        },
      ],
      type: "FeatureCollection",
    },
  },
};
