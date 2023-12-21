import "../myfooter/myfooter.css"

function MyFooter(){



return (<>

<div className="footer-section mt-5">
        <p className="footer-text">
          Questions? <a href=" ">Call 000-800-040-1843</a>
        </p>
    
        <div className="footer-subsection">
     
          <div>
            <ul className="sites">
              <li><a href=" ">FAQ</a></li>
              <li><a href=" ">Investor Relations</a></li>
              <li><a href=" ">Privacy</a></li>
              <li><a href=" ">Speed Test</a></li>
              {/* <li>
                <button id="footer-buttonOne">
                  <i className="fa fa-globe fa-2x" aria-hidden="true"></i>
                  English
                  <i className="fa fa-angle-down fa-2x" aria-hidden="true"></i>
                </button>
                <div id="dropdown">
                  <ul>
                    <li>English</li>
                    <li>हिन्दी</li>
                  </ul>
                </div>
              </li> */}
              {/* <li><a href="">Netflix India</a></li> */}
            </ul>
          </div>
      
          <div>
            <ul className="sites">
              <li><a href="">Help Centre</a></li>
              <li><a href="">Jobs</a></li>
              <li><a href="">Cookie Preferences</a></li>
              <li><a href="">Legal Notices</a></li>
            </ul>
          </div>
        
          <div>
            <ul className="sites">
              <li><a href="">Account</a></li>
              <li><a href="">Ways to Watch</a></li>
              <li><a href="">Corporate Information</a></li>
              <li><a href="">Only on Ace</a></li>
            </ul>
          </div>
        
          <div>
            <ul className="sites">
              <li><a href="">Media Centre</a></li>
              <li><a href="">Terms of Use</a></li>
              <li><a href="">Contact Us</a></li>
            </ul>
          </div>
        </div>

      </div>
    
</>)
}

export default MyFooter




