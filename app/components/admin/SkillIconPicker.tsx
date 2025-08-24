'use client';

import { useMemo } from 'react';
import * as si from 'react-icons/si'; // simple-icons via react-icons

type Option = { key: string; label: string; Icon: React.ComponentType<{ size?: number }> };

const KEYS = [
  // Languages & Core
  'SiPython','SiJavascript','SiTypescript','SiJava','SiC','SiCplusplus','SiGo',
  // Web / FE
  'SiReact','SiNextdotjs','SiVite','SiTailwindcss','SiBootstrap',
  // Backend
  'SiNodedotjs','SiExpress','SiFlask','SiSpring','SiDjango',
  // DB
  'SiMongodb','SiMysql','SiPostgresql','SiSupabase','SiSqlite',
  // Cloud & DevOps
  'SiDocker','SiKubernetes','SiAmazonaws','SiGooglecloud','SiMicrosoftazure',
  // Data/ML
  'SiNumpy','SiPandas','SiScikitlearn','SiTensorflow','SiPytorch','SiOpenai',
  // Tools
  'SiGit','SiGithub','SiGitlab','SiLinux','SiJest','SiTestinglibrary',
];

export const TECH_ICON_OPTIONS: Option[] = KEYS
  .filter((k) => (si as any)[k])
  .map((k) => ({ key: k, label: k.replace(/^Si/, ''), Icon: (si as any)[k] }));

export default function SkillIconPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (key: string) => void;
}) {
  const options = useMemo(() => TECH_ICON_OPTIONS, []);
  return (
    <div className="grid grid-cols-6 gap-2">
      {options.map(({ key, label, Icon }) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`p-2 rounded border flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 ${active ? 'ring-2 ring-blue-500' : ''}`}
            title={label}
          >
            <Icon size={24} />
          </button>
        );
      })}
    </div>
  );
}
