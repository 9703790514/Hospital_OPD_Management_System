package training.iqgateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("/api")
public class Controller {
	
	@GetMapping
	public String hello() {
		return "Hello, World!";
	}

}
