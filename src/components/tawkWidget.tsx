import Script from 'next/script';

const TawkWidget = () => {
	return (
		<Script
			id='intercom-script'
			strategy='lazyOnload'
			dangerouslySetInnerHTML={{
				__html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
 (function(){
 var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
 s1.async=true;
 s1.src='https://embed.tawk.to/686300ec319b9019082a5ca4/1iv1cuf3k';
 s1.charset='UTF-8';
 s1.setAttribute('crossorigin','*');
 s0.parentNode.insertBefore(s1,s0);
 })();`,
			}}
		/>
	);
};

export default TawkWidget;

// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/686300ec319b9019082a5ca4/1iv1cuf3k';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->

// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/686300ec319b9019082a5ca4/1iv1bn7ir';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->

// propertyId='686300ec319b9019082a5ca4'
// widgetId='1iv1bn7ir'
