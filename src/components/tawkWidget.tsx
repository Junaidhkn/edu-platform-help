'use client';

import Script from 'next/script';

const TawkWidget = () => {
	const chatLinkSource = process.env.CHAT_LINK_SOURCE;
	if (!chatLinkSource) {
		return null;
	}
	return (
		<Script
			id='tawk-to-script'
			strategy='lazyOnload'
			dangerouslySetInnerHTML={{
				__html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src = '${chatLinkSource}'; 
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `,
			}}
		/>
	);
};

export default TawkWidget;
