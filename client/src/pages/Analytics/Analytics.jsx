import React, { useState, useEffect } from 'react';
import styles from './Analytics.module.css';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { getByCategory, getMonthlySummary } from '../../services/summaryService';

function Analytics() {
  const [period, setPeriod] = useState('all');
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Теперь ждём выполнения асинхронных запросов
      const categoryData = await getByCategory('expense', period);
      setPieChartData(categoryData);

      const monthlyData = await getMonthlySummary(6);
      setBarChartData(monthlyData);
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка аналитики...</div>;
  }

  return (
    <div className={styles.analytics}>
      <h1 className={styles.title}>Аналитика</h1>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.chartTitle}>Расходы по категориям</h2>
            
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

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <BarChart data={barChartData} title="Доходы и расходы по месяцам" />
        </div>
      </div>
    </div>
  );
}

export default Analytics;