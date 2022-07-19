import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import { useStarknet, useConnectors } from '@starknet-react/core'
import { trimAddress } from 'utils'
import Link from 'next/link'
import Image from 'next/image'
import icon from '../static/logo.svg'
import { useRouter } from 'next/router'
import styles from '../../styles.module.css'

const pages = [
  { label: 'Prescription', route: '/prescription' },
  { label: 'Verify', route: '/verify' },
]
const settings = ['Disconnect']

export const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const router = useRouter()

  const { account } = useStarknet()
  const { available, connect, disconnect } = useConnectors()

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: 'white', boxShadow: 'none' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Image src={icon} width="20px" height="20px" layout="intrinsic" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { md: 'flex' },
              fontFamily: 'Raleway',
              fontWeight: 900,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              color: '#25282A',
              marginLeft: '4px',
            }}
          >
            ASCUE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { md: 'flex' },
            }}
          >
            {pages.map((page) => (
              <Button
                sx={{
                  fontFamily: "'Raleway','Noto Sans HK','Noto Sans SC'",
                  fontWeight: 'bold',
                  color: 'white',
                  border: '2px solid #25282A',
                  borderRadius: '20px',
                  padding: '4px 30px',
                  textTransform: 'none',
                  margin: '0 10px',
                  '&:hover': {
                    backgroundColor: '#D1D3D4',
                  },
                }}
                style={
                  router.pathname === page.route
                    ? { backgroundColor: '#25282A' }
                    : {}
                }
              >
                <Link key={page.route} href={page.route}>
                  <a
                    style={
                      router.pathname === page.route
                        ? {
                            color: 'white',
                            textDecoration: 'none',
                            fontFamily:
                              "'Raleway','Noto Sans HK','Noto Sans SC'",
                            fontWeight: 'bold',

                            marginRight: '6px',
                          }
                        : {
                            color: '#25282A',
                            textDecoration: 'none',
                            fontFamily:
                              "'Raleway','Noto Sans HK','Noto Sans SC'",
                            fontWeight: 'bold',

                            marginRight: '6px',
                          }
                    }
                  >
                    {page.label}
                  </a>
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Connect Wallet">
              <Button
                sx={{
                  fontFamily: "'Raleway','Noto Sans HK','Noto Sans SC'",
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#25282A',
                  borderRadius: '20px',
                  padding: '4px 30px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#D1D3D4',
                  },
                }}
                onClick={handleOpenUserMenu}
              >
                {account ? trimAddress(account) : 'Connect Wallet'}
              </Button>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {account
                ? settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        disconnect()
                        handleCloseUserMenu()
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Raleway','Noto Sans HK','Noto Sans SC'",
                          fontWeight: 'bold',
                          color: '#25282A',
                        }}
                        textAlign="center"
                      >
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))
                : available.map((connector) => (
                    <MenuItem
                      key={connector.id()}
                      onClick={(e) => {
                        connect(connector)
                        handleCloseUserMenu()
                      }}
                    >
                      {`Connect ${connector.name()}`}
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
