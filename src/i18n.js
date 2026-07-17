import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      appTitle: 'Canadian Employment Dashboard',
      bymonth_title:'Employment Rate by Month in Canada',
      startMonth: 'Start:',
      endMonth: 'End:',
      employmentLegend: 'Employment Rate',
      populationOfCanada: 'Population of Canada',
      latestQuarter: 'latest quarter',
      largestProvince: 'Largest province',
      dataSource: 'Data source',
      sourceName: 'Statistics Canada',
      populationOverTime: 'Population over time',
      populationByProvince: 'Population by province',
      shareOfPopulation: 'Share of national population',
      loadError: 'Failed to load data',
      bymonth_yAxisLabel: 'Employed Persons in Thousands',
      bymonth_xAxisLabel: 'Month and Year',
      dataSourceTitle: 'Data Source',
      sourceMonthly: 'Statistics Canada, table 14-10-0287-01.',
      sourceProvince: 'Statistics Canada, table 14-10-0017-02.',
      all: 'All',
      employmentRate: 'Employment Rate',
      employmentRateByProvince: 'Employment Rate by Province, January 2026',
      barXAxisLabel: 'Province',
      barYAxisLabel: 'Percentage of population employed',
    },
  },
  fr: {
    translation: {
      appTitle: 'Tableau de bord de l\'emploi au Canada',
      bymonth_title:"Taux d'emploi par mois au Canada",
      startMonth: 'Début:',
      endMonth: 'Fin:',
      employmentLegend: 'Taux d\'emploi',
      populationOfCanada: 'Population du Canada',
      latestQuarter: 'dernier trimestre',
      largestProvince: 'Province la plus peuplée',
      dataSource: 'Source des données',
      sourceName: 'Statistique Canada',
      populationOverTime: 'Population au fil du temps',
      populationByProvince: 'Population par province',
      shareOfPopulation: 'Part de la population nationale',
      loadError: 'Échec du chargement des données',
      bymonth_yAxisLabel: 'Personnes employées en milliers',
      bymonth_xAxisLabel: 'Mois et année',
      dataSourceTitle: 'Source de données',
      sourceMonthly: 'Statistique Canada, tableau 14-10-0287-01.',
      sourceProvince: 'Statistique Canada, tableau 14-10-0017-02.',
      all: 'Tous',
      employmentRate: "Taux d'emploi",
      employmentRateByProvince: "Taux d'emploi par province, janvier 2026",
      barXAxisLabel: 'Province',
      barYAxisLabel: 'Pourcentage de la population employée',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',            // default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React already escapes
})

export default i18n