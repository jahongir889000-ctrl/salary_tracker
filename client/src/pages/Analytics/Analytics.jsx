import React, { useState, useEffect } from "react";
import PieChart from "../../components/PieChart/PieChart";
import BarChart from "../../components/BarChart/BarChart";
import { getByCategory, getMonthlySummary } from "../../services/summaryService";

function Analytics() {
  // Состояние для выбора периода в круговой диаграмме
  const [period, setPeriod] = useState("all");

  // Состояние данных для графиков
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Функция загрузки данных
  const loadData = async () => {
    try {
      setIsLoading(true);

      // Параллельно загружаем данные для обоих графиков
      const [categoryData, monthlyData] = await Promise.all([
        getByCategory("expense", period),
        getMonthlySummary(6),
      ]);

      // Гарантируем, что в состояниях всегда массивы
      setPieChartData(Array.isArray(categoryData) ? categoryData : []);
      setBarChartData(Array.isArray(monthlyData) ? monthlyData : []);
    } catch (error) {
      console.error("Ошибка загрузки аналитики:", error);
      alert("Не удалось загрузить данные аналитики. Проверьте, запущен ли сервер.");
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при монтировании и изменении периода
  useEffect(() => {
    loadData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-secondary">
        <span className="size-9 animate-spin rounded-full border-[3px] border-border border-t-primary" />
        <p className="animate-shimmer text-sm">Загрузка аналитики...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="page-title">Аналитика</h1>

      {/* Сетка графиков */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Круговая диаграмма расходов по категориям */}
        <section className="card animate-rise p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold tracking-tight text-text">
              Расходы по категориям
            </h2>

            {/* Селектор периода */}
            <select
              className="field w-auto cursor-pointer py-2 pr-8 text-sm"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              aria-label="Период"
            >
              <option value="all">Всё время</option>
              <option value="today">Сегодня</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="year">Год</option>
            </select>
          </div>

          <PieChart data={pieChartData} />
        </section>

        {/* Столбчатый график доходов/расходов по месяцам */}
        <section
          className="card animate-rise p-5 sm:p-6"
          style={{ animationDelay: "90ms" }}
        >
          <h2 className="mb-4 text-lg font-bold tracking-tight text-text">
            Доходы и расходы по месяцам
          </h2>

          <BarChart data={barChartData} />
        </section>
      </div>
    </div>
  );
}

export default Analytics;
