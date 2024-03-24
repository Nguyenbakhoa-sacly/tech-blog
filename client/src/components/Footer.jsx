import React from 'react'
import { Footer, FooterLinkGroup } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs'
const FooterComp = () => {
  return (
    <Footer container className='border'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-col-1'>
          <div className='mt-5'>
            <Link to={'/'} className='self-center whitespace-nowrap text-lg
        sm:text-xl font-semibold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
          via-purple-500 to-pink-500 rounded-lg text-white'>Technology</span>
              Blog
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3'>
            <div>
              <Footer.Title title='About' />
              <FooterLinkGroup col>
                <Footer.Link
                  href='http://www.100jsprjects.com'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  100 JS Project
                </Footer.Link>
                <Footer.Link
                  href='/about'
                >
                  Technology Blog
                </Footer.Link>
              </FooterLinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' />
              <FooterLinkGroup col>
                <Footer.Link
                  href='http://www.github.com/Nguyenbakhoa-sacly'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href='https://discord.com/channels/@me'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Discord
                </Footer.Link>
              </FooterLinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <FooterLinkGroup col>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Terms &amp; conditions
                </Footer.Link>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href='#'
            by=" Technology Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-4 mt-4 sm:mt-0 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook} />
            <Footer.Icon href='#' icon={BsInstagram} />
            <Footer.Icon href='#' icon={BsTwitter} />
            <Footer.Icon href='#' icon={BsGithub} />

          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterComp
