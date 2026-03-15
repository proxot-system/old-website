"use client";
import NavBar from "../components/NavBar/nav-bar";
import Footer from "../components/footer";

export default function PrivacyPolicy() {
	return (
		<div className="bg-black h-max w-full">
			<div className="font-main py-32 grid justify-center">
				<div className="px-5 w-auto max-w-[1000px]">
					<h1 className="text-5xl text-twm-sun text-center">
						Terms and Conditions
					</h1>
					<p className="text-md mt-14 text-center">
						These Terms and Conditions ("Terms") govern your use of our
						services. By using our services, you agree to be bound by these
						Terms. If you do not agree with these Terms, please do not use our
						services.
						<br></br>
						<br></br>
						1. Use of Services<br></br>
						You must comply with all applicable laws and regulations when using
						our services, including Discord's own Terms of Service.
						<br></br>
						<br></br>
						2. User Content<br></br>
						You are solely responsible for the content you submit or display
						through our services. We do not endorse or assume any responsibility
						for user-generated content.
						<br></br>
						<br></br>
						3. Privacy<br></br>
						We collect and use information as described in our Privacy Policy.
						By using our services, you consent to the collection and use of your
						data.
						<br></br>
						<br></br>
						4. Disclaimer<br></br>
						Our services are provided "as is" without warranties of any kind,
						either expressed or implied. We do not guarantee the accuracy,
						reliability, or availability of our services.
						<br></br>
						<br></br>
						5. Limitation of Liability<br></br>
						We shall not be liable for any indirect, consequential, or special
						damages arising out of or in any way related to your use of our
						services.
						<br></br>
						<br></br>
						6. Changes to Terms<br></br>
						We reserve the right to modify or revise these Terms at any time.
						Your continued use of our services constitutes acceptance of the
						updated Terms.
						<br></br>
						<br></br>
						7. Contact<br></br>
						If you have any questions or concerns about these Terms, please
						contact us at our support server or message the bot's owner
						(axiinyaa).
						<br></br>
						<br></br>
						These Terms were last updated on November 1st, 2023.
					</p>
				</div>

				<button
					onClick={() => (window.location.href = "/")}
					className="text-2xl text-black w-1/12 mx-auto mt-10"
				>
					Back
				</button>
			</div>
		</div>
	);
}
