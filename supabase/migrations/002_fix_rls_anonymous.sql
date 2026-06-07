-- 修复：移除 auth.users 外键约束，允许匿名使用
-- 注意：必须先删策略再改列类型！

-- 第一步：删除旧 RLS 策略
DROP POLICY IF EXISTS "Users can view own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON goals;
DROP POLICY IF EXISTS "Users can update own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON goals;

DROP POLICY IF EXISTS "Users can view own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can insert own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can update own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can delete own schedules" ON schedules;

DROP POLICY IF EXISTS "Users can view own diet_logs" ON diet_logs;
DROP POLICY IF EXISTS "Users can insert own diet_logs" ON diet_logs;
DROP POLICY IF EXISTS "Users can update own diet_logs" ON diet_logs;
DROP POLICY IF EXISTS "Users can delete own diet_logs" ON diet_logs;

-- 第二步：移除外键约束 + 改列类型 + 允许 NULL
ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_user_id_fkey;
ALTER TABLE goals ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE goals ALTER COLUMN user_id TYPE text;

ALTER TABLE schedules DROP CONSTRAINT IF EXISTS schedules_user_id_fkey;
ALTER TABLE schedules ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE schedules ALTER COLUMN user_id TYPE text;

ALTER TABLE diet_logs DROP CONSTRAINT IF EXISTS diet_logs_user_id_fkey;
ALTER TABLE diet_logs ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE diet_logs ALTER COLUMN user_id TYPE text;

-- 第三步：创建公开访问策略
CREATE POLICY "Public access to goals" ON goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to schedules" ON schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to diet_logs" ON diet_logs FOR ALL USING (true) WITH CHECK (true);

-- 第四步（可选）：扩充食物数据（需先执行 ALTER TABLE food_suggestions ADD CONSTRAINT food_suggestions_name_unique UNIQUE (name)）
INSERT INTO food_suggestions (name, calories_per_100g, category) VALUES
('馒头', 223, '主食'),
('面条', 110, '主食'),
('小米粥', 46, '主食'),
('红薯', 86, '主食'),
('玉米', 112, '主食'),
('猪瘦肉', 143, '蛋白质'),
('虾仁', 48, '蛋白质'),
('带鱼', 127, '蛋白质'),
('豆浆(无糖)', 14, '饮品'),
('番茄', 18, '蔬菜'),
('黄瓜', 16, '蔬菜'),
('生菜', 15, '蔬菜'),
('芹菜', 16, '蔬菜'),
('土豆', 81, '蔬菜'),
('草莓', 32, '水果'),
('葡萄', 45, '水果'),
('西瓜', 31, '水果'),
('猕猴桃', 61, '水果'),
('芒果', 60, '水果'),
('核桃', 654, '坚果'),
('腰果', 553, '坚果'),
('杏仁', 579, '坚果'),
('披萨', 266, '快餐'),
('汉堡', 295, '快餐'),
('炸鸡', 260, '快餐'),
('薯条', 312, '快餐'),
('方便面', 473, '快餐'),
('奶茶', 80, '饮品'),
('可乐', 42, '饮品'),
('橙汁', 45, '饮品')
ON CONFLICT (name) DO NOTHING;