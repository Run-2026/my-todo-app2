-- 创建目标表
create table goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() references auth.users on delete cascade,
  title text not null,
  description text,
  type text check (type in ('long', 'short')) default 'short',
  deadline date,
  status text check (status in ('active', 'completed', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建日程表
create table schedules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() references auth.users on delete cascade,
  type text check (type in ('diet', 'exercise', 'sleep', 'work', 'relax')) default 'exercise',
  title text not null,
  start_time time not null,
  end_time time not null,
  days_of_week int[] default '{1,2,3,4,5}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建饮食记录表
create table diet_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() references auth.users on delete cascade,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')) default 'breakfast',
  food_name text not null,
  calories int not null,
  date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建食物建议表
create table food_suggestions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  calories_per_100g int not null,
  category text default '其他',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建每日建议表
create table daily_tips (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  category text default 'general',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用行级安全（RLS）
alter table goals enable row level security;
alter table schedules enable row level security;
alter table diet_logs enable row level security;
alter table food_suggestions enable row level security;
alter table daily_tips enable row level security;

-- 创建RLS策略：用户只能看到自己的数据
create policy "Users can view own goals" on goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on goals for delete using (auth.uid() = user_id);

create policy "Users can view own schedules" on schedules for select using (auth.uid() = user_id);
create policy "Users can insert own schedules" on schedules for insert with check (auth.uid() = user_id);
create policy "Users can update own schedules" on schedules for update using (auth.uid() = user_id);
create policy "Users can delete own schedules" on schedules for delete using (auth.uid() = user_id);

create policy "Users can view own diet_logs" on diet_logs for select using (auth.uid() = user_id);
create policy "Users can insert own diet_logs" on diet_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own diet_logs" on diet_logs for update using (auth.uid() = user_id);
create policy "Users can delete own diet_logs" on diet_logs for delete using (auth.uid() = user_id);

-- 食物建议表允许所有人读取
create policy "Anyone can view food_suggestions" on food_suggestions for select using (true);

-- 每日建议允许所有人读取
create policy "Anyone can view daily_tips" on daily_tips for select using (true);

-- 插入示例食物数据
insert into food_suggestions (name, calories_per_100g, category) values
('米饭', 116, '主食'),
('全麦面包', 247, '主食'),
('燕麦片', 389, '主食'),
('鸡胸肉', 165, '蛋白质'),
('牛肉', 250, '蛋白质'),
('鸡蛋', 155, '蛋白质'),
('三文鱼', 208, '蛋白质'),
('豆腐', 76, '蛋白质'),
('西兰花', 34, '蔬菜'),
('菠菜', 23, '蔬菜'),
('胡萝卜', 41, '蔬菜'),
('苹果', 52, '水果'),
('香蕉', 89, '水果'),
('橙子', 47, '水果'),
('牛奶', 54, '饮品'),
('酸奶', 70, '饮品'),
('豆浆', 31, '饮品'),
('坚果', 607, '零食'),
('黑巧克力', 546, '零食'),
('牛油果', 160, '水果');

-- 插入示例每日建议
insert into daily_tips (content, category) values
('早餐是一天中最重要的一餐，记得吃富含蛋白质的食物！', '饮食'),
('每天步行6000步以上可以显著降低心血管疾病风险。', '运动'),
('睡前一小时远离电子屏幕，可以提高睡眠质量。', '睡眠'),
('喝水时加一片柠檬，既补充维生素C又增加饮水量。', '饮食'),
('工作45分钟后站起来伸展5分钟，保护颈椎和腰椎。', '健康'),
('深呼吸三次：吸气4秒，屏息4秒，呼气6秒，立即缓解压力。', '放松'),
('吃七分饱就好，给肠胃留点空间，身体会更轻松。', '饮食'),
('周末安排一次户外活动，阳光是最好的情绪调节剂。', '心理健康'),
('睡前泡脚15分钟，水温40°C左右，促进全身血液循环。', '睡眠'),
('今天试试冥想5分钟，专注呼吸，什么也不想。', '放松'),
('用白开水代替含糖饮料，一个月能减少摄入约2kg糖分。', '饮食'),
('午餐后散步10分钟，比坐着刷手机更有利于消化。', '健康'),
('给自己定个睡觉闹钟，到点就准备休息，规律作息比补觉更重要。', '睡眠'),
('每天感恩三件小事，写在纸上或记在心里，幸福感会提升。', '心理健康'),
('坚果虽好，但每天一小把就够了，热量很高哦。', '饮食');
