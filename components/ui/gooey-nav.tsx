"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import './gooey-nav.css';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface GooeyNavProps {
  items: NavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  initialActiveIndex?: number;
  onItemClick?: (index: number) => void;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 400,
  particleCount = 6,
  particleDistances = [30, 5],
  particleR = 80,
  timeVariance = 200,
  initialActiveIndex = 0,
  onItemClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const noise = useCallback((n = 1) => n / 2 - Math.random() * n, []);

  const getXY = useCallback((distance: number, pointIndex: number, totalPoints: number) => {
    const angle = ((360 + (0.5 - Math.random()) * 8) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  }, []);

  const makeParticles = useCallback((container: HTMLElement) => {
    const d = particleDistances;
    const r = particleR;

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + (0.5 - Math.random()) * (timeVariance * 2);
      const rotate = (0.5 - Math.random()) * (r / 10);
      const start = getXY(d[0], particleCount - i, particleCount);
      const end = getXY(d[1] + (0.5 - Math.random()) * 7, particleCount - i, particleCount);

      const particle = document.createElement('span');
      const point = document.createElement('span');
      particle.classList.add('particle');
      particle.style.setProperty('--start-x', `${start[0]}px`);
      particle.style.setProperty('--start-y', `${start[1]}px`);
      particle.style.setProperty('--end-x', `${end[0]}px`);
      particle.style.setProperty('--end-y', `${end[1]}px`);
      particle.style.setProperty('--time', `${t}ms`);
      particle.style.setProperty('--scale', `${1 + (0.5 - Math.random()) * 0.2}`);
      particle.style.setProperty('--rotate', `${(rotate > 0 ? (rotate + r / 20) : (rotate - r / 20)) * 10}deg`);

      point.classList.add('point');
      particle.appendChild(point);
      container.appendChild(particle);

      setTimeout(() => {
        try { container.removeChild(particle); } catch { /* already removed */ }
      }, t);
    }
  }, [animationTime, particleCount, particleDistances, particleR, timeVariance, getXY]);

  const updateEffectPosition = useCallback((element: HTMLElement) => {
    if (!containerRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    Object.assign(textRef.current.style, {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    });

    const labelSpan = element.querySelector('.label-text');
    textRef.current.innerText = labelSpan ? (labelSpan as HTMLElement).innerText : '';
  }, []);

  const handleClick = useCallback((index: number, element: HTMLElement) => {
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(element);
    onItemClick?.(index);

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    // Spawn particles at the clicked element
    makeParticles(element);
  }, [activeIndex, updateEffectPosition, onItemClick, makeParticles]);

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex, updateEffectPosition]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={index} className={activeIndex === index ? 'active' : ''}>
              <Link
                href={item.href}
                onClick={(e) => handleClick(index, e.currentTarget.parentElement!)}
                className="flex flex-col items-center"
              >
                {item.icon && <span className="material-symbols-outlined text-lg mb-0.5">{item.icon}</span>}
                <span className={hasMounted && activeIndex === index ? 'label-text opacity-0' : 'label-text'}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Single effect span - text overlay for the active label */}
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
