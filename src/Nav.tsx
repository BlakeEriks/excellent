import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './components/ui/navigation-menu'

type NavProps = {
  active: string
  setActive: (value: string) => void
}

const Nav = ({ active, setActive }: NavProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem onClick={() => setActive('overview')}>
          <NavigationMenuLink
            active={active === 'overview'}
            className={navigationMenuTriggerStyle()}
          >
            Overview
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem onClick={() => setActive('records')}>
          <NavigationMenuLink
            active={active === 'records'}
            className={navigationMenuTriggerStyle()}
          >
            Records
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem onClick={() => setActive('streaks')}>
          <NavigationMenuLink
            active={active === 'streaks'}
            className={navigationMenuTriggerStyle()}
          >
            Streaks
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem onClick={() => setActive('goals')}>
          <NavigationMenuLink active={active === 'goals'} className={navigationMenuTriggerStyle()}>
            Goals
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default Nav
