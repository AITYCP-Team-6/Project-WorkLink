package com.workLink.workLink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class WorkLinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkLinkApplication.class, args);
	}

}
