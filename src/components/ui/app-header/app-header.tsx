import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.link_active)
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon
                type={'primary'}
                className={clsx(styles.svg, isActive && styles.svg_active)}
              />{' '}
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.link_active)
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon
                type={'primary'}
                className={clsx(styles.svg, isActive && styles.svg_active)}
              />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            clsx(styles.link, isActive && userName && styles.link_active)
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon
                type={'primary'}
                className={clsx(
                  styles.svg,
                  isActive && userName && styles.svg_active
                )}
              />
              <p className='text text_type_main-default ml-2'>
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
