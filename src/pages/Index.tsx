import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Roach {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  name: string;
}

const Index = () => {
  const [arenaSize, setArenaSize] = useState([50]);
  const [roachCount, setRoachCount] = useState([3]);
  const [lightIntensity, setLightIntensity] = useState([50]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [roaches, setRoaches] = useState<Roach[]>([]);
  const [selectedRoach, setSelectedRoach] = useState<number | null>(null);
  const [userPrediction, setUserPrediction] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = ['#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const roachNames = ['Альфа', 'Бета', 'Гамма', 'Дельта', 'Эпсилон'];

  useEffect(() => {
    initializeRoaches();
  }, [roachCount]);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        updateSimulation();
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isSimulating, roaches]);

  useEffect(() => {
    drawCanvas();
  }, [roaches, arenaSize]);

  const initializeRoaches = () => {
    const newRoaches: Roach[] = Array.from({ length: roachCount[0] }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      speed: Math.random() * 2 + 1,
      color: colors[i % colors.length],
      name: roachNames[i % roachNames.length]
    }));
    setRoaches(newRoaches);
    setWinner(null);
  };

  const updateSimulation = () => {
    setRoaches(prev => {
      const updated = prev.map(roach => {
        let newX = roach.x + (Math.random() - 0.5) * roach.speed;
        let newY = roach.y + (Math.random() - 0.5) * roach.speed;
        
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));

        if (newX > 90 && newY < 10 && !winner) {
          setWinner(roach.id);
          setIsSimulating(false);
          if (userPrediction === roach.id) {
            setScore(prev => prev + 10);
          }
        }

        return { ...roach, x: newX, y: newY };
      });
      return updated;
    });
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.strokeRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9);
    
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.05);
    ctx.lineTo(w * 0.3, h * 0.4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.25);
    ctx.lineTo(w * 0.5, h * 0.7);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.7, h * 0.5);
    ctx.lineTo(w * 0.7, h * 0.95);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.05, h * 0.6);
    ctx.lineTo(w * 0.4, h * 0.6);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.35);
    ctx.lineTo(w * 0.95, h * 0.35);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.15, h * 0.8);
    ctx.lineTo(w * 0.55, h * 0.8);
    ctx.stroke();

    ctx.fillStyle = '#FCD34D';
    ctx.globalAlpha = lightIntensity[0] / 100;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.9, canvas.height * 0.1, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = '#10B981';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.9, canvas.height * 0.1, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    roaches.forEach(roach => {
      const x = (roach.x / 100) * canvas.width;
      const y = (roach.y / 100) * canvas.height;
      
      ctx.fillStyle = roach.color;
      ctx.save();
      ctx.translate(x, y);
      
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = roach.color;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.ellipse(-8, 0, 4, 2, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(8, 0, 4, 2, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-3, -1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(3, -1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      if (selectedRoach === roach.id) {
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setWinner(null);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    initializeRoaches();
    setUserPrediction(null);
    setGameStarted(false);
    setWinner(null);
  };

  const startGame = () => {
    setGameStarted(true);
    initializeRoaches();
    setUserPrediction(null);
    setWinner(null);
  };

  const makePrediction = (id: number) => {
    setUserPrediction(id);
    setIsSimulating(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r="1"
                fill="#06B6D4"
                className="animate-pulse-glow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <div className="animate-fade-in">
            <Badge variant="outline" className="mb-6 text-primary border-primary">
              <Icon name="FlaskConical" className="mr-2" size={16} />
              Data Science × Web Visualization
            </Badge>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RoachAnalytics
            </h1>
            <p className="text-2xl text-muted-foreground mb-4">
              Исследуем поведение насекомых через данные
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Учебный проект по data science и веб-визуализации
            </p>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Icon name="Play" size={20} />
              Начать исследование
            </Button>
          </div>
        </div>
      </section>

      <section id="lab" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Виртуальная лаборатория</h2>
            <p className="text-muted-foreground">Симулятор экспериментов с настраиваемыми параметрами</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Box" size={20} />
                  Арена экспериментов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full border border-border rounded-lg"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    
                    roaches.forEach(roach => {
                      const distance = Math.sqrt(Math.pow(roach.x - x, 2) + Math.pow(roach.y - y, 2));
                      if (distance < 5) {
                        setSelectedRoach(roach.id);
                      }
                    });
                  }}
                />
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={startSimulation} disabled={isSimulating} className="gap-2">
                    <Icon name="Play" size={16} />
                    Запустить
                  </Button>
                  <Button onClick={stopSimulation} disabled={!isSimulating} variant="outline" className="gap-2">
                    <Icon name="Pause" size={16} />
                    Пауза
                  </Button>
                  <Button onClick={resetSimulation} variant="outline" className="gap-2">
                    <Icon name="RotateCcw" size={16} />
                    Сброс
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Параметры эксперимента</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Размер арены: {arenaSize[0]}м
                    </label>
                    <Slider
                      value={arenaSize}
                      onValueChange={setArenaSize}
                      min={20}
                      max={100}
                      step={10}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Количество особей: {roachCount[0]}
                    </label>
                    <Slider
                      value={roachCount}
                      onValueChange={setRoachCount}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Интенсивность света: {lightIntensity[0]}%
                    </label>
                    <Slider
                      value={lightIntensity}
                      onValueChange={setLightIntensity}
                      min={0}
                      max={100}
                      step={10}
                    />
                  </div>
                </CardContent>
              </Card>

              {selectedRoach !== null && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">Характеристики особи</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Название:</span>
                        <span className="font-medium">{roaches[selectedRoach]?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Скорость:</span>
                        <span className="font-medium">{roaches[selectedRoach]?.speed.toFixed(2)} м/с</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Цвет:</span>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: roaches[selectedRoach]?.color }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Визуализация данных</h2>
            <p className="text-muted-foreground">Анализ паттернов движения и статистика</p>
          </div>

          <Tabs defaultValue="heatmap" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
              <TabsTrigger value="speed">Скорость</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
            </TabsList>
            
            <TabsContent value="heatmap" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Карта популярных маршрутов</CardTitle>
                  <CardDescription>Визуализация наиболее часто используемых траекторий</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                      {Array.from({ length: 100 }).map((_, i) => {
                        const intensity = Math.random();
                        return (
                          <div
                            key={i}
                            className="border border-background/10"
                            style={{
                              backgroundColor: `rgba(6, 182, 212, ${intensity * 0.5})`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Сравнительная скорость особей</CardTitle>
                  <CardDescription>Средняя скорость перемещения за эксперимент</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roaches.map((roach) => (
                    <div key={roach.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: roach.color }}
                          />
                          <span className="text-sm font-medium">{roach.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{roach.speed.toFixed(2)} м/с</span>
                      </div>
                      <Progress value={roach.speed * 25} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Всего экспериментов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">127</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Средняя скорость
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">1.84 м/с</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Время анализа
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">42 ч</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">База знаний</h2>
            <p className="text-muted-foreground">Методология исследований и научные данные</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-2">
                  <Icon name="BookOpen" size={20} />
                  Описание экспериментов
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Наши эксперименты основаны на классических методах изучения поведения насекомых.
                Мы анализируем реакцию особей на различные стимулы: источники света, температуру,
                запахи и препятствия. Каждый эксперимент записывается и анализируется с помощью
                компьютерного зрения и статистических методов.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-2">
                  <Icon name="BarChart3" size={20} />
                  Статистические методы
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Для анализа траекторий движения используются методы машинного обучения,
                включая кластеризацию (K-means), регрессионный анализ и нейронные сети.
                Статистическая значимость результатов проверяется с помощью t-теста и ANOVA.
                Визуализация данных выполняется с использованием D3.js и WebGL.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-2">
                  <Icon name="Bug" size={20} />
                  Биологические особенности
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Тараканы обладают уникальными способностями к навигации и адаптации.
                Их скорость может достигать 1.5 м/с, а реакция на опасность составляет около 50 мс.
                Исследования показывают, что особи используют комбинацию химических и визуальных
                сигналов для ориентации в пространстве.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">
                <div className="flex items-center gap-2">
                  <Icon name="FileText" size={20} />
                  Научные публикации
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Результаты исследований публикуются в международных журналах по энтомологии
                и биоинформатике. Основные работы посвящены анализу коллективного поведения,
                оптимизации алгоритмов отслеживания и применению методов компьютерного зрения
                для изучения насекомых.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Проверь свою интуицию</h2>
            <p className="text-muted-foreground">Игровой модуль на основе реальных данных</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Угадай победителя</span>
                <Badge variant="secondary" className="gap-2">
                  <Icon name="Trophy" size={16} />
                  Очки: {score}
                </Badge>
              </CardTitle>
              <CardDescription>
                Изучи характеристики особей и сделай прогноз, кто первым достигнет цели
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!gameStarted ? (
                <div className="text-center py-8">
                  <Button onClick={startGame} size="lg" className="gap-2">
                    <Icon name="Play" size={20} />
                    Начать игру
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-3">
                    {roaches.map((roach) => (
                      <button
                        key={roach.id}
                        onClick={() => !isSimulating && makePrediction(roach.id)}
                        disabled={isSimulating}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          userPrediction === roach.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        } ${winner === roach.id ? 'ring-2 ring-primary' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: roach.color }}
                            />
                            <div>
                              <div className="font-medium">{roach.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Скорость: {roach.speed.toFixed(2)} м/с
                              </div>
                            </div>
                          </div>
                          {winner === roach.id && (
                            <Badge className="gap-1">
                              <Icon name="Trophy" size={14} />
                              Победитель
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {winner !== null && (
                    <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary">
                      {userPrediction === winner ? (
                        <div className="text-primary font-medium">
                          🎉 Правильно! +10 очков
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          Победил {roaches[winner]?.name}. Попробуй еще раз!
                        </div>
                      )}
                      <Button onClick={startGame} className="mt-4" variant="outline">
                        Новая игра
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">О проекте</h2>
            <p className="text-muted-foreground">Техническая документация и технологии</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Code2" size={20} />
                  Технологический стек
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    React + TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Canvas API для визуализации
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Tailwind CSS + shadcn/ui
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Симуляция на основе физики
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Target" size={20} />
                  Цели проекта
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Изучение поведения насекомых
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Практика data visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Интерактивные симуляции
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Образовательный контент
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Github" size={20} />
                Открытый исходный код
              </CardTitle>
              <CardDescription>
                Проект разрабатывается как open source для образовательных целей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="gap-2">
                <Icon name="ExternalLink" size={16} />
                Посмотреть на GitHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>RoachAnalytics © 2025 — Учебный проект по data science</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;