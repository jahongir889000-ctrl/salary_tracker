import React, { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import PieChart from "../../components/PieChart/PieChart";
import BarChart from "../../components/BarChart/BarChart";
import {
  getByCategory,
  getMonthlySummary,
} from "../../services/summaryService";

function Analytics() {
  // Состояние для выбора периода в круговой диаграмме
  const [period, setPeriod] = useState("all");

  // Состояние данных для графиков
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Загрузка данных при монтировании и изменении периода
  useEffect(() => {
    loadData();
  }, [period]);

  // Функция загрузки данных
  const loadData = () => {
    // Данные для круговой диаграммы (расходы по категориям)
    const categoryData = getByCategory("expense", period);
    setPieChartData(categoryData);

    // Данные для столбчатого графика (помесячная статистика)
    const monthlyData = getMonthlySummary(6); // Последние 6 месяцев
    setBarChartData(monthlyData);
  };

  return (
    <div className={styles.analytics}>
      <h1 className={styles.title}>Аналитика</h1>

      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        {/* Круговая диаграмма расходов по категориям */}
        <div className={styles.chartCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.chartTitle}>Расходы по категориям</h2>

            {/* Селектор периода */}
            <select
              className={styles.periodSelect}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="all">Всё время</option>
              <option value="today">Сегодня</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="year">Год</option>
            </select>
          </div>

          <PieChart data={pieChartData} title="Расходы по категориям" />
        </div>

        {/* Столбчатый график доходов/расходов по месяцам */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>

          <BarChart data={barChartData} title="Доходы и расходы по месяцам" />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
